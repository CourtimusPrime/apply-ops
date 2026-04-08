# Mode: sop — Statement of Purpose

<!-- ============================================================
     SYSTEM FILE — auto-updatable. Do not put personal data here.
     User customizations → modes/_profile.md or config/profile.yml
     ============================================================ -->

## Trigger

User says "write SOP for [program]", "draft my statement of purpose", "write my personal
statement for [university]", or any similar request.

---

## Pre-flight

1. Read `cv.md` (academic background, education, projects, publications, experience)
2. Read `config/profile.yml` (research interests, narrative, academic profile, degree goals)
3. Read `modes/_profile.md` (program-type framing, strengths, positioning)
4. Check `reports/` for the program's evaluation report:
   - If found: read it — use Block E (faculty names, research emphasis) and Block C
     (program type, positioning advice) and Block G (SOP outline if score ≥ 4.5)
   - If not found: proceed with generic framing; note the limitation:
     > "No evaluation report found for this program. Faculty alignment will be generic.
     > For best results, run a program evaluation first (`/career-ops program [URL]`)."
5. Detect program type:
   - From the evaluation report's detected type, OR
   - From `profile.yml → target_programs.track_preference`, OR
   - Ask: "Is this program research-track (thesis, advisor, lab) or professional-track
     (coursework, capstone, career placement)?"

---

## SOP Structure (6 paragraphs)

**Paragraph 1 — Opening hook**
- Research-track: a specific intellectual problem or open question that motivated the
  applicant's choice of field. Not "I've always loved computers." A concrete tension or
  puzzle.
- Professional-track: a concrete project outcome, failure, or challenge that revealed a
  gap in the applicant's skills or understanding — and pointed toward this degree as the
  path forward.

**Paragraph 2 — Academic journey**
- How undergraduate preparation led to the current focus
- Reference specific courses, labs, or thesis work from `cv.md` by name
- Mark the transition point to the applicant's current research or professional focus
- No vague claims — every claim must be traceable to `cv.md`

**Paragraph 3 — Research focus / technical depth**
- Surface 2–3 specific research interests from `profile.yml → academic_profile.research_interests`
- Cite 1–2 relevant projects from `cv.md` by name and explain the technical contribution
- Research-track ONLY: name 2–3 specific faculty members from the evaluation report's
  Block E (or from `profile.yml` if no report). For each, write one sentence explaining
  the research alignment — be specific, not flattering
- If `profile.yml` has a `publications` block and program is research-track: reference
  at least one publication in this paragraph

**Paragraph 4 — What you will contribute**
- Unique strengths or perspectives from `profile.yml → narrative.academic_strengths`
- Non-obvious background the program benefits from having in the cohort
- Cross-disciplinary angles, industry experience feeding into research, or unusual
  methodological exposure — whatever makes this applicant different from the median admit

**Paragraph 5 — Career goals**
- What comes after the degree: PhD program, industry research, specific practice area,
  or founding work
- Why an MS now rather than going directly to the end state
- Keep this realistic and connected to what's already been said — no sudden pivots

**Paragraph 6 — Why this program**
- Specific: curriculum feature, lab, named faculty, cohort structure, industry partnership
- NEVER generic praise ("this prestigious institution", "world-class faculty")
- Research-track: thesis advisor interest or lab culture
- Professional-track: capstone structure, alumni network in a specific sector, or industry
  partnership angle

---

## Tonal Adaptation

**Research-track MS:**
- Technical vocabulary appropriate to the field
- Cite specific paper titles, methods, or datasets where relevant
- Express advisor interest and readiness to contribute to a lab
- First-person past tense for prior work; future-oriented framing for goals

**Professional-track MS:**
- Outcome-focused language — what did you build, deliver, improve?
- Quantify project impact where possible (from `cv.md` — never invent numbers)
- Frame career goals in terms of industry problems to solve, not academic milestones

---

## Word Count Guidance

| Program type | Target | Flag threshold |
|-------------|--------|---------------|
| Research-track MS | 750–1000 words | >1200 or <600 |
| Professional-track MS | 500–750 words | >900 or <400 |

If the draft falls outside the flag threshold, note it at the top of the output:
> "⚠️ Draft is [X] words — [over/under] the recommended range for this program type. Consider [cutting/expanding] [paragraph]."

---

## Block G Integration

If the evaluation report contains a Block G (SOP outline), use it as the structural
skeleton for this draft. Flesh out each point with content from `cv.md` and `profile.yml`.
Note at the top: "Draft based on Block G outline from evaluation report #{num}."

---

## Output

Save to `output/sop-{university-slug}-{YYYY-MM-DD}.md`.

```markdown
# Statement of Purpose — {University}: {Program}

**Date:** {YYYY-MM-DD}
**Program type:** {Research-track / Professional-track}
**Word count:** {N}
**Based on report:** {###} or "no evaluation report"

---

{6-paragraph SOP}

---

⚠️ STOP — Review before copying to your application portal. Verify every claim
against your cv.md. Do not paste without reading.
```

---

## Rules

1. **NEVER cite metrics from memory.** Read all GPA figures, scores, dates, project
   names, and outcomes from `cv.md` and `profile.yml` at generation time.
2. **NEVER write generic praise** ("this prestigious institution", "renowned faculty",
   "world-class resources"). All program-specific content must come from the evaluation
   report or the user's explicit description.
3. **NEVER submit or copy to any portal.** Generate and stop. The applicant decides.
4. **Always end with the mandatory STOP notice** (see Output section above).
5. **Faculty names must come from a source** — evaluation report Block E, the program
   faculty page (via WebSearch or Playwright), or the user's own input. Never invent
   faculty names or research areas.
6. **If Block G exists in the report and score ≥ 4.5,** use it as the structural seed.
   Do not ignore it.
