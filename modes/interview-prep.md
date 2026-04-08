# Mode: interview-prep — Graduate Admissions Interview Prep

Prepares the applicant for a graduate program interview or visit day. Triggered when
the user is invited to interview, or when tracker status moves to `Interview`.

## Inputs

1. **University and program** (required)
2. **Program evaluation report** in `reports/` — load for fit analysis and faculty notes
3. **Deep research brief** in `interview-prep/{slug}.md` — load if exists
4. **`cv.md`** and **`config/profile.yml`** — read for research background and narrative
5. **Story bank** at `interview-prep/story-bank.md` — read for prepared academic narratives
   (research breakthroughs, intellectual turning points, collaboration challenges,
   moments that clarified research direction)

## Step 0: Format Detection (required before anything else)

WebSearch: `"{university} {program} admissions interview format"`

Determine:
- Does this program conduct admissions interviews? (many MS programs do not)
- Interview format: admissions committee, faculty 1:1, panel, video essay, or none
- Timing: pre-offer vs. post-offer vs. visit day only

**If the program does not conduct admissions interviews:**
> "[University] [program] does not appear to conduct admissions interviews based on
> available information. If you've been contacted for an interview, verify whether
> this is a standard step or a special circumstance — and share the invitation details
> so I can tailor prep accordingly."
> Exit this mode.

If format is genuinely unknown, note this and provide generic academic interview
prep with a clear caveat at the top of the output.

---

## 5-Step Output

### 1. Interview Overview

- Format (committee, 1:1, panel, video essay) and typical length
- Who conducts the interview (admissions committee, faculty, current students)
- What the program says it evaluates (research fit, communication, intellectual depth,
  academic readiness — source from program website or published materials)
- Any known quirks or distinctive features of this program's interview process
- Source all claims. Write "unknown" rather than guess.

---

### 2. Likely Question Types

Categorize the expected questions into five types. For each type, describe what a
strong answer looks like given this specific applicant's profile (read from cv.md
and profile.yml — not generic advice).

**a. Research fit**
Examples: "Tell me about your research interests." "What problem do you want to work on?"
Strong answer framework for this applicant: [tailored to their specific research interests]

**b. Program fit**
Examples: "Why this program?" "Which faculty would you want to work with and why?"
Strong answer framework: [reference specific faculty from evaluation report or deep brief]

**c. Academic background**
Examples: "Walk me through your undergraduate thesis." "Tell me about a course that
shaped your thinking."
Strong answer framework: [draw from cv.md §Education and Research Experience]

**d. Career goals**
Examples: "Where do you see yourself in 5 years?" "Are you interested in academia
or industry?"
Strong answer framework: [draw from profile.yml → academic_goals, career_trajectory]

**e. Personal**
Examples: "Tell me about a challenge you overcame." "What's a failure you learned from?"
Strong answer framework: [draw from story bank or ask user for relevant context]

---

### 3. Story Bank Mapping

Read `interview-prep/story-bank.md`. For each likely question type above, identify
which existing stories map well.

For each mapping:
- Story title / brief description
- Which question type it addresses
- Any adaptation needed (e.g., "this story works for question type c, but needs a
  stronger conclusion about what you learned")

**Gap analysis:**
- Question types with no good story in the bank
- For each gap: suggest specifically what story the applicant should develop, and
  the key details it should include

Note: The story bank for graduate admissions should focus on academic narratives —
research moments, intellectual turning points, collaboration challenges, moments
that clarified research direction. STAR-format work stories from job applications
are generally not appropriate for academic interviews unless directly relevant to
research experience.

---

### 4. Questions to Ask Them

Generate 5–7 sharp questions the applicant can ask the interviewer.

Questions must be specific to this program and interviewer context — not generic.
Generic questions ("What's the best part of your program?") are not acceptable.

Categories to cover:
- **Faculty-specific** (if interviewing with a specific professor): based on their
  recent work — "In your 2024 paper on [X], you mention [Y] as future work — is that
  something your group is actively pursuing?"
- **Program structure**: curriculum, thesis vs. coursework options, typical advising
  relationship for MS students
- **Funding**: stability and availability for MS students, typical TA/RA load,
  external fellowship support
- **Cohort culture**: how students collaborate, lab culture, department seminars
- **Outcomes**: where recent graduates have gone (specific to MS, not PhD, if relevant)

Each question should be one sentence. No multi-part questions.

---

### 5. Visit Day Logistics (if applicable)

If the interview is part of a visit day or fly-out weekend:

**What to prepare:**
- A 2–3 sentence research statement you can deliver verbally without notes
- Questions for each faculty meeting (use the questions from Step 4 as a base)
- A clear sense of your top 2–3 research directions — you will be asked repeatedly

**What to observe:**
- Lab culture: Do students seem engaged and supported? Do they speak openly about
  their research? How do they describe the advisor relationship?
- Funding security: Are funded students confident about their continued support?
- Peer cohort: Do the current students seem like people you'd want to work with
  for 2+ years?

**Who to seek out:**
- Current students in the lab(s) you're most interested in — ask them what they
  wish they'd known before joining
- Program coordinator or director of graduate studies — they know the program
  culture better than faculty do

**Visit day etiquette:**
- Take notes openly — it signals engagement, not disorganization
- It is appropriate to ask about other programs you're considering; it signals
  that you're taking the decision seriously
- It is not appropriate to ask about acceptance probability or compare your
  application to others in the room

---

## Output

Save the complete prep brief to:
`interview-prep/{university-slug}-{program-slug}-interview.md`

Example: `interview-prep/mit-eecs-phd-interview.md`

## Rules

- Never fabricate interview questions and attribute them to a specific source.
  If a program's interview questions are documented, cite the source. Otherwise,
  derive likely questions from the program's stated evaluation criteria.
- Cite all process intelligence (interview format, duration, who interviews).
- If interview format is unknown, provide generic academic interview prep and
  label it clearly as generic — do not present guesses as program-specific facts.
- Story bank content is user data — describe how to use existing stories, but
  do not modify `interview-prep/story-bank.md` in this mode.
