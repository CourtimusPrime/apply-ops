# Mode: contacto — Professor Cold Email

Drafts a targeted cold email to a potential research supervisor at a target graduate
program. Designed to open a relationship before the application deadline — not to
request admission.

## Inputs

1. **University and program** (required)
2. **`cv.md`** — read for research background and relevant experience
3. **`config/profile.yml`** — read for research interests, degree target, funding preference
4. **Program evaluation report** (`reports/`) and/or deep research brief
   (`interview-prep/{slug}.md`) — load if available for faculty identification

## Pre-send Warning (always display first)

> **Before sending:** Many programs explicitly discourage pre-application contact
> with faculty. Check the program's admissions FAQ before sending this email. If
> the FAQ says "do not contact faculty directly" or "faculty cannot influence
> admissions decisions", do not send this email. Sending it anyway can hurt your
> application.

---

## Workflow

### Step 1: Faculty Identification

Check whether faculty candidates are already identified:
- Evaluation report Block B/C (faculty alignment section)
- Deep research brief Axis 1 (faculty research directions)

If candidates are already identified: load them and proceed to Step 2.

If no candidates identified yet: run a targeted WebSearch to find 2–3 faculty
whose published work overlaps with the applicant's research interests:
- `"{university} {department} faculty {research_interest}"`
- `"{professor name} recent publications 2024 2025"`

For each candidate confirm: active lab, recent publications, and evidence of
currently supervising students (PhD or MS).

### Step 2: Select Primary Target

Choose the single strongest match based on:
1. Research alignment (their recent work vs. applicant's stated interests)
2. Likelihood of taking new students (active lab, recent student activity)
3. Career stage (associate or full professor — more stable than assistant professors
   who may not yet have funding for MS students)

Explain the selection rationale briefly to the user before drafting.

### Step 3: Draft the Email

**Hard limit: 150–200 words total.** Count words. Do not exceed 200.

**Subject line format:** `Research inquiry — [Applicant Last Name], [brief topic]`

Example: `Research inquiry — Chen, multi-agent planning under uncertainty`

**Body structure (3 parts):**

**Part 1 — Specificity (1–2 sentences):**
Show you have read a specific piece of their work. Name the paper or project
by title. Say one concrete thing it connects to in your own work or thinking.

Good: "Your 2024 paper on causal inference in sparse observational data addresses
exactly the identification problem I ran into in my undergraduate research on
[X] — specifically, your instrument validity bounds seem applicable to [Y]."

Bad: "I have read your work and found it very interesting and inspiring."

**Part 2 — Background (2–3 sentences):**
Your single most relevant credential or research experience. What question you
want to pursue at the graduate level. Be specific — one research question, not
a list of interests.

**Part 3 — Ask (1 sentence):**
A narrow, low-friction request. Never ask to join the lab or for admission help.

Good: "Would you be open to a brief call to discuss your work on [X]?"

Bad: "I am hoping to join your lab and would love to discuss opportunities."

**Mandatory omissions — never include:**
- GPA or test scores
- Generic phrases: "I am passionate about", "I have always been fascinated by",
  "I would be honored"
- Flattery about the university or their reputation
- A list of your interests — pick one

### Step 4: Alternative Targets

After the primary draft, provide 1–2 alternative faculty targets with:
- Name and brief research description
- Why they are a good second choice
- Any important difference in approach vs. the primary target (e.g., more
  industry-connected, more theoretical, earlier career)

---

## Output Format

```
**Primary target:** [Professor Name], [Title], [Department]
**Rationale:** [2–3 sentences on why this person, why now]

---
Subject: Research inquiry — [Last Name], [topic]

Dear Professor [Last Name],

[Body — 150–200 words]

Best regards,
[Applicant Name]
[Email] | [LinkedIn or personal site if applicable]

---
**Word count:** [n]

**Alternative targets:**
1. [Name] — [rationale]
2. [Name] — [rationale]
```

---

## Rules

- Never exceed 200 words in the email body.
- Never mention GPA, test scores, or grades.
- Never use generic phrases ("passionate about", "honored to", "inspired by your work").
- Never ask to join the lab or request admission help.
- Always cite the specific paper or project referenced in Part 1 — do not reference
  "your recent work" without naming it.
- If no specific recent paper can be identified via WebSearch, do not fabricate a
  reference — ask the user to identify a paper before drafting.
