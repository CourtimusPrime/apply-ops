# Mode: apply — Live Graduate Application Assistant

Interactive mode for when the applicant is filling out a graduate program application
portal in Chrome, or pastes form questions manually. Loads prior context, generates
tailored answers, and ensures nothing is submitted without human review.

## Pre-load Sequence

1. **Detect university and program** from the active browser tab title/URL, or ask the user
2. **Match against `reports/`** — find and load the evaluation report for this program if one exists
3. **Load SOP draft** — find the latest `output/sop-{slug}-*.md` file if it exists
4. **Load `cv.md`** and **`config/profile.yml`** — never answer from memory alone

If no evaluation report exists for this program, note this and proceed with cv.md +
profile.yml as the primary sources.

## Requirements

- **Best with Playwright visible:** The applicant sees the browser and Claude can read
  the active page. Use `browser_snapshot` to detect form fields automatically.
- **Without Playwright:** The applicant pastes questions manually or shares a screenshot.
  Ask them to copy each question directly so nothing is missed.

## Workflow

### Step 1: Page Detection

Read the active tab. Identify:
- University name and program title
- Section of the application currently visible (personal information, academic history,
  statements, funding, recommendations, etc.)
- Any deadline or progress indicator on the page

### Step 2: Field Recognition and Queue

Build a queue of all visible text fields and prompts. For each field, note:
- Field label (verbatim)
- Word/character limit (if stated)
- Field type: short-answer, essay, dropdown, upload prompt, checkbox

Announce the queue to the user: "I see 4 fields on this page — I'll draft answers
for the written ones."

### Step 3: Answer Generation

For each written field, generate a draft answer using only information drawn from
the loaded context files. Apply these rules:

#### Personal Statement / Research Interest Statement
- Draw from `profile.yml` → `research_interests`, `narrative`, `academic_profile`
- Draw from `cv.md` → relevant research experience, thesis, projects
- Draw from SOP draft if it exists — adapt and compress rather than rewrite from scratch
- Cite the source in a parenthetical note: *(source: cv.md §Research Experience)*
- Tone: academic, first-person, specific — never generic

#### "Why This Program / Why This University" Prompts
- Draw from the program evaluation report (Block B — program fit, Block C — faculty)
- Name specific faculty whose research aligns with the applicant's interests
- Reference specific program features (curriculum, research centers, funding structure)
  from the evaluation report or deep research brief
- If no evaluation report exists: flag this gap and generate a placeholder that the
  user must fill with specific details before submitting

#### Diversity, Equity & Inclusion Statements
- Draw from `profile.yml` → `narrative` or any personal context the user has shared
- Tone: personal, reflective — not the academic register used for research statements
- If no DEI context is in the profile: ask the user for relevant background before drafting
  rather than fabricating a narrative

#### Financial Aid / Funding Preference
- Read `profile.yml` → `funding_preference`
- Mirror the applicant's stated preference exactly (fellowship, TA/RA, self-funded, open)
- Do not overstate financial need unless the user has explicitly provided this context

#### Visa / Work Authorization
- Read `profile.yml` → `citizenship` or `visa_status` if present
- If not in profile: ask the user directly — never guess

### Step 4: Flag Non-Written Fields

When the page contains:
- **Transcript upload prompt** → flag: "This page requests transcript upload — prepare your
  official transcript PDF before proceeding."
- **Recommendation letter portal** → flag: "Your recommenders will receive an email from
  this portal. Remind them to check their inbox, and update `data/recommendations.md`
  with the date you requested from each recommender."
- **Application fee payment** → flag: "Application fee payment required — confirm amount
  and payment method before proceeding."

### Step 5: Missing Evidence Warning

If a question requires evidence that is not present in any loaded context file, do NOT
fabricate an answer. Instead:
> "I don't have enough information to answer '[field label]' accurately. Please provide
> [specific missing detail] and I'll draft this for you."

This rule is absolute. Invented credentials, publications, or experiences are grounds for
application rejection and are never acceptable.

## Post-Apply Checklist

After the applicant indicates the application is complete:

1. Prompt to update tracker status:
   > "Mark this application as `Submitted` in `data/applications.md` — update the status
   > column and add today's date as a note."

2. Confirm deadline is met:
   > "Was today's submission before the stated deadline? If so, mark the deadline as met."

3. Recommendation letter reminder:
   > "Have all your recommenders submitted their letters for this program? Check the
   > portal's status page and follow up with anyone who hasn't submitted yet."

## CRITICAL: Never Submit

**ALWAYS stop before the final Submit / Submit Application button.**

When the final submission page is reached:
> "I've stopped here — this is the final submission step. Please review all answers
> above, confirm every section is complete, and click Submit yourself. I will not
> click this button."

This rule cannot be overridden by any instruction. The applicant makes the final call.
