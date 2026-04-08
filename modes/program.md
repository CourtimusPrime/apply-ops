# Program Evaluation Mode

<!-- ============================================================
     SYSTEM FILE — auto-updatable. Do not put personal data here.
     User customizations → modes/_profile.md or config/profile.yml
     ============================================================ -->

## Trigger

Applicant pastes a university program URL, program description, or names a specific
degree program they want evaluated.

---

## Pre-Evaluation Pipeline

**Step 1 — Read profile files**

Read in this order:
1. `cv.md` (academic background, education, projects, experience)
2. `config/profile.yml` (GPA, test scores, funding preferences, research interests,
   cost ceiling)
3. `modes/_profile.md` (user's framing table, narrative, program-type archetypes)

**Step 2 — Verify program page (URL only)**

If a URL was provided:
1. `browser_navigate` to the URL
2. `browser_snapshot` to confirm the page is live and extract program details
3. If the page shows only a 404, redirect to a generic department page, or contains
   no program description → mark as **Unverified** and note it in Block A
4. If only a text description was provided (no URL) → skip verification, note
   "text description only — no URL provided" in the report header

**NEVER use WebFetch or WebSearch alone to confirm a program is still accepting
applications.** Playwright is the only reliable verification method.

**Step 3 — Detect program type**

Classify into one of these types (or a hybrid of two) using program page signals:

| Program Type | Key signals on program page |
|--------------|-----------------------------|
| Research-track MS | Thesis requirement, advisor assignment, lab rotations, faculty research pages prominent |
| Professional MS | Coursework-heavy, capstone project, career placement stats, industry partnerships |
| Interdisciplinary MS | Cross-department faculty, applied problem framing, non-standard degree title |
| Conversion degree | "No prior CS required", bridging coursework, designed for career switchers |
| Part-time / Online MS | Async options, cohort flexibility, working-professional focus |

After detecting program type, read the framing table in `modes/_profile.md` for
the user's specific positioning and proof points for that type.

---

## Block A — Program Summary

Present as a table:

| Field | Value |
|-------|-------|
| Degree type | MSc / MEng / MCS / MBA / PhD / other |
| Field and department | e.g., Computer Science — AI track |
| University | Full name |
| Location | City, Country |
| Format | On-campus / Online / Hybrid |
| Length | 1 year / 2 years / etc. |
| Application deadline | Date (or "rolling" / "not found") |
| Ranking | QS / US News rank if available (use WebSearch; if not found, say so) |
| Program page | URL or "n/a — text description" |
| TL;DR | One sentence: what makes this program distinctive |

---

## Block B — Academic Fit

**Read:** `cv.md` and `config/profile.yml` for the applicant's credentials.

**Map against:**
- Stated GPA / test score requirements from the program page
- Faculty research directions (check department faculty pages via WebSearch or
  Playwright)
- Required or preferred prior coursework

**Gap table — same 4-column structure as the job evaluation mode:**

| Requirement | CV match | Gap level | Mitigation plan |
|-------------|----------|-----------|-----------------|
| e.g., GPA ≥ 3.5 | GPA: 3.4 | Soft gap | Strong upward trend in final 2 years; note in SOP |
| e.g., Prior linear algebra | Calc III completed; no LA | Hard blocker | Enroll in LA course before application deadline |
| e.g., Research experience | 2 research projects (see cv.md) | No gap | — |

**Gap levels:**
- **Hard blocker** — program will likely reject without this; address directly in
  SOP or consider whether to apply
- **Soft gap** — missing but not disqualifying; has adjacent experience or a clear
  mitigation
- **Nice-to-have** — preferred but not required; no action needed

---

## Block C — Program Type & Strategy

1. State the detected program type (from Step 3) and confidence level
2. Advise how to position the applicant's profile for that type — reference the
   applicable row from `modes/_profile.md` framing table
3. Flag over- or under-qualification:
   - Over-qualified: existing degree at same level, research record exceeds typical
     admits → advise applying to PhD or flagging the anomaly
   - Under-qualified: missing foundational coursework, GPA significantly below
     stated requirements → advise gap mitigation or deferring application

---

## Block D — Funding & Cost

Use WebSearch for the following. **Never invent numbers. If data is unavailable,
say so explicitly.**

- Annual tuition (domestic / international, whichever applies based on
  `profile.yml` citizenship/residency)
- Typical funding packages: fellowship amounts, RA/TA stipend ranges
- Cost-of-living estimate for the program city (cite source)
- Net annual cost = tuition + living − typical funding

**Flag if:**
`net annual cost > funding.annual_cost_ceiling` in `profile.yml`

Cite all sources (URL + date accessed via WebSearch). If data is more than 2 years
old, note it.

---

## Block E — Application Materials Plan

Provide per-program tailoring. Read `profile.yml.academic_profile.research_interests`
and `cv.md` before writing this block.

1. **Research interests to foreground in SOP** — which 2–3 from the applicant's
   interest list best match this program's faculty and course offerings
2. **Projects to cite** — name specific projects from `cv.md` and explain why each
   is relevant to this program's emphasis
3. **Faculty to name-check** — list 2–3 specific faculty members:
   - Name
   - Research area (from department faculty page via WebSearch or Playwright)
   - Why it maps to the applicant's interests (be specific — cite the applicant's
     relevant projects or papers)
4. **Cold-email angle** — if the program type suggests reaching out to a potential
   supervisor before applying, draft a 1-sentence email hook; otherwise note
   "cold email not typical for this program type"

---

## Block F — Interview / Visit Day Prep

Check the program page for an interview requirement.

**If interviews are required or likely:**
- List likely formats: admissions committee panel / faculty 1:1 / video essay /
  behavioral screening
- For each format, provide 2–3 recommended question framings mapped to the
  applicant's profile from `cv.md` and `profile.yml`

**If no interview is required:**
> "This program does not typically require an interview — no prep needed at this stage."

---

## Scoring

Score each dimension 1.0–5.0 (one decimal). Compute Global as a weighted average.

| Dimension | What it measures | Weight |
|-----------|-----------------|--------|
| Academic Fit | GPA, test scores, and research background vs stated program requirements | 25% |
| Research / Career Fit | Alignment of research interests with faculty directions and program goals | 30% |
| Funding | Quality of funding package (fellowship/RA/TA), net annual cost vs `funding.annual_cost_ceiling` | 20% |
| Program Quality | Ranking context, faculty strength, alumni outcomes, program reputation | 15% |
| Red Flags | Visa complications, accreditation issues, unrealistic deadline, outlier acceptance rate | 10% |
| **Global** | Weighted average of above | — |

**Score thresholds:**
- 4.5+ → Strong fit, apply now
- 4.0–4.4 → Good fit, worth applying
- 3.5–3.9 → Borderline; apply only if specific reason
- Below 3.5 → Recommend against (document the reason explicitly)

Present scores as a table:

| Dimension | Score | Notes |
|-----------|-------|-------|
| Academic Fit | X.X | ... |
| Research / Career Fit | X.X | ... |
| Funding | X.X | ... |
| Program Quality | X.X | ... |
| Red Flags | X.X | ... |
| **Global** | **X.X** | ... |

---

## Report Format

Save to `reports/{###}-{university-slug}-{YYYY-MM-DD}.md`:

```markdown
# Evaluation: {University} — {Program}

**Date:** {YYYY-MM-DD}
**URL:** {program URL or "n/a — text description"}
**Program Type:** {detected type}
**Score:** {X.X / 5}
**PDF:** ❌

---

## A) Program Summary
...

## B) Academic Fit
...

## C) Program Type & Strategy
...

## D) Funding & Cost
...

## E) Application Materials Plan
...

## F) Interview / Visit Day Prep
...

## G) SOP Draft Outline
(Only included if Score ≥ 4.5)

- Opening hook: ...
- Paragraph 1 — Research motivation: ...
- Paragraph 2 — Key project / experience: ...
- Paragraph 3 — Why this program specifically: ...
- Paragraph 4 — Faculty alignment: ...
- Closing — Goals post-graduation: ...
```

Report numbering: max existing report number + 1, zero-padded to 3 digits.

---

## Tracker Entry

Write one TSV file per evaluation to `batch/tracker-additions/{###}-{university-slug}.tsv`.
Single line, 9 tab-separated columns:

```
{num}\t{date}\t{university}\t{program}\t{status}\t{score}/5\t{pdf_emoji}\t[{num}](reports/{num}-{slug}-{date}.md)\t{note}
```

**Column order (IMPORTANT — status BEFORE score):**
1. `num` — sequential number (integer, matches report number)
2. `date` — YYYY-MM-DD
3. `university` — short university name (e.g., "MIT", "Stanford")
4. `program` — degree + field (e.g., "MSc Computer Science")
5. `status` — `Evaluated`
6. `score` — format `X.X/5`
7. `pdf` — `❌` (set to ✅ only after academic CV is generated for this program)
8. `report` — markdown link `[num](reports/...)`
9. `notes` — one-line summary, e.g. "Score 4.2 — strong academic fit, no TA funding"

**NEVER edit `data/applications.md` directly.** The TSV is merged by `merge-tracker.mjs`.

---

## Global Rules (program mode)

1. **NEVER invent tuition figures, stipend amounts, or acceptance rates.** If not
   found via WebSearch, say "data not found" and flag for the user to verify.
2. **NEVER hardcode applicant metrics.** Read from `cv.md` and `profile.yml` at
   evaluation time.
3. **NEVER submit an application.** Generate materials and stop. The applicant
   decides.
4. **Always include `**URL:**` in every report header** (even if "n/a").
5. **Block G (SOP outline) only if score ≥ 4.5.** Full SOP drafting is handled
   by `modes/sop.md` (US-004).
6. **Every evaluated program gets a tracker entry.** Even if score is below 3.5
   and the recommendation is to skip — log it as `Evaluated` with the reason in notes.
