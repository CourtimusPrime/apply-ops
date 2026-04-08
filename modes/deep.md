# Mode: deep — Graduate Program Deep Research

Produces a structured intelligence brief on a graduate program across six axes.
Designed to run before writing application materials — the output feeds the SOP,
the contacto mode, and the apply mode.

## Inputs

1. **University name and program title** (required — ask if not provided)
2. **`cv.md`** — read for research background and interests
3. **`config/profile.yml`** — read for funding preference, target degree type, research interests
4. **Program evaluation report** in `reports/` — load if it exists (skip redundant research)

## Output

Saved to `interview-prep/{university-slug}-{program-slug}.md`.

Example filename: `interview-prep/mit-eecs-phd.md`

## Workflow

### Step 1: Pre-check

Before searching, check whether a deep research brief already exists for this program:
- `interview-prep/{slug}.md` or a program evaluation report in `reports/`

If a recent brief exists (written within the past 6 months), load it and ask:
> "I already have a brief for [program] from [date]. Do you want me to refresh it or
> use the existing one?"

### Step 2: Research — Six Axes

Run WebSearch for each axis. **Every factual claim must include a citation.**
If data is genuinely unavailable, write "Not published" — never estimate or interpolate.

---

#### Axis 1: Faculty Research Directions

Goal: Identify 3–5 faculty whose active research overlaps with the applicant's interests.

Search queries:
- `"{university} {department} faculty research {research_interest} 2024 2025"`
- `"{professor name} recent publications lab"`

For each faculty candidate, record:
- Name and title
- Lab or group name
- 2–3 recent publications or funded projects (last 2 years preferred)
- One-sentence description of how their work connects to the applicant's stated interests
- Lab page URL

Only include faculty who appear to be actively supervising students (not emeritus,
not on leave, not primarily administrative).

---

#### Axis 2: Recent Admissions Data

Search for published statistics only. Do not estimate.

Collect (mark each as "published" or "not published"):
- Acceptance rate
- Median or range GPA for admitted students
- Median GRE Verbal, Quantitative, Analytical Writing (note if GRE is no longer required)
- Typical cohort size
- Percentage of international students in recent cohort
- Application deadline(s) — early action vs. regular

Sources: program website, grad cafe aggregates, official annual reports.

---

#### Axis 3: Funding Landscape

Collect:
- Whether MS students are typically funded (fully funded, partial, primarily self-funded)
- Named fellowships offered by the program or university (e.g., Dean's Fellowship, NSF GRFP eligibility, Hertz, NDSEG)
- TA/RA availability for MS students (vs. PhD-only)
- Annual tuition (in-state and out-of-state if applicable)
- Estimated total cost of attendance per year
- Typical net cost after funding (if published)

Flag prominently if the program is primarily self-funded:
> **Funding note:** This program appears to be primarily self-funded for MS students.
> Verify before investing significant application effort.

---

#### Axis 4: Alumni Outcomes

Collect:
- Industry placement data (companies, roles, % going to industry vs. academia)
- Academic placement (PhD programs, postdocs, faculty positions)
- Notable alumni (sourced — do not guess)
- Time to degree (median for MS)

Sources: LinkedIn alumni search, program website outcomes page, rankings methodology reports.

---

#### Axis 5: Program Reputation and Peers

Collect:
- US News graduate program ranking (note the year)
- QS World University Rankings subject ranking (if relevant)
- Shanghai ARWU (if relevant)
- The program's distinctive angle — what it does that peer programs do not
- 3–4 peer programs the applicant should also consider, with brief rationale

Do not editorialize about ranking quality. Report figures and note the year.

---

#### Axis 6: Applicant Angle

This axis is generated from the applicant's profile — no additional WebSearch needed.

Read `cv.md` and `config/profile.yml` carefully. Produce:

**Strongest alignment points** (2–4 bullets):
- Where the applicant's background maps directly to the program's strengths
- Specific faculty whose work matches the applicant's research interests

**Gaps to address in the SOP** (1–3 bullets):
- Weaknesses in the application relative to this program's typical admits
- How to frame or contextualize each gap (e.g., upward GPA trend, adjacent experience)

**Faculty to cold-email** (1–3 names with rationale):
- Prioritized by research alignment and likelihood of taking new students
- Note any signals of openness (recent lab page updates, active funding, recent grad student departures)

**Suggested SOP angle for this program:**
- One paragraph framing how this applicant should position themselves specifically
  for this program — not a generic SOP opener, but a program-specific narrative hook

---

## Output Format

```markdown
# Deep Research Brief: [University] — [Program]
**Date:** YYYY-MM-DD
**Sources:** [n] citations

## 1. Faculty Research Directions
...

## 2. Recent Admissions Data
...

## 3. Funding Landscape
...

## 4. Alumni Outcomes
...

## 5. Program Reputation and Peers
...

## 6. Applicant Angle
...

---
*Sources*
1. [citation]
2. [citation]
...
```

## Rules

- Every factual claim in axes 1–5 requires a citation. No exceptions.
- Write "Not published" when data is unavailable. Never estimate acceptance rates,
  GPA medians, or funding amounts.
- Do not copy-paste from program websites at length — summarize and cite.
- Axis 6 may include inferences based on the applicant's profile — clearly label
  these as analysis, not reported facts.
