# Mode: research-statement — Research Statement

<!-- ============================================================
     SYSTEM FILE — auto-updatable. Do not put personal data here.
     User customizations → modes/_profile.md or config/profile.yml
     ============================================================ -->

## Trigger

User says "write research statement", "write my RS for [program]", "I need a research
statement for [university]", or any similar request.

---

## Pre-flight

1. Read `cv.md` — focus on research experience, publications, thesis, and research projects
2. Read `config/profile.yml` — research interests, academic profile, career goals
3. Check `reports/` for the program's evaluation report:
   - If found: read Block E (faculty names and research emphasis) and Block C (program type)
   - If not found: note the limitation and proceed with generic faculty section
4. Assess research depth in `cv.md`:
   - **Minimal research experience** (no research roles, no publications, no thesis, no
     research-designated projects) → warn:
     > "Your cv.md has limited formal research experience. A research statement may not
     > be required or expected for your program type. Consider whether an SOP is more
     > appropriate (`/career-ops sop`). Proceed with research statement anyway? (yes/no)"
   - If yes: proceed in exploratory mode regardless of program type
5. Detect specificity mode from program type:
   - Research-track MS, thesis MS, or PhD-adjacent → **defined-agenda mode**
   - Professional-track MS or conversion degree → **exploratory mode**

---

## Specificity Modes

### Defined-agenda mode (research-track / PhD-adjacent)

Used when the program expects a specific, arguable research plan.

- State a concrete research question or problem space (not a topic — a question)
- Describe preliminary work or findings that support approaching this question
- Propose a methodology, even if tentative: tools, theoretical framework, data sources
- Name specific faculty whose active work overlaps with the proposed question

### Exploratory mode (MS-track / professional-track)

Used when the program expects intellectual direction rather than a research proposal.

- Frame as "I want to investigate the space of X" — not a hypothesis, but a direction
- Reference existing literature or active research debates in the area to show awareness
- Explain why this direction matters now and what remains open
- Show that you know enough to be curious, not that you have a specific answer

---

## Research Statement Structure (4 paragraphs)

**Paragraph 1 — Research background**
- Prior research roles, lab positions, thesis work, or substantial research projects
  from `cv.md`
- What you learned from doing research — not just what the project was, but what it
  taught you about how to ask questions, run experiments, or interpret results
- The intellectual thread connecting these experiences to your current interests

**Paragraph 2 — Open research question**
- The specific problem (defined-agenda) or direction (exploratory) you want to pursue
- Why it matters: what happens if this question is answered, or what can't be done
  without progress in this direction
- What remains unknown or contested in the field — show you've read the literature

**Paragraph 3 — Proposed approach**
- Defined-agenda: concrete methodology, tools, theoretical framing, data sources,
  preliminary hypotheses. Acknowledge what's uncertain.
- Exploratory: general approach and why this program's resources (courses, labs, faculty,
  datasets) are the right environment for exploring this direction
- Do not overstate certainty in either mode — research statements that sound too polished
  raise credibility questions

**Paragraph 4 — Faculty and program fit**
- 2–3 faculty members from the evaluation report's Block E (or from WebSearch via the
  program's faculty page if no report exists)
- For each: one sentence on why their active research and yours overlap — be specific
  about the project or paper, not just the general area
- Explain what the program structure offers that a different program or self-directed
  study cannot

---

## Word Count Guidance

| Mode | Target | Flag threshold |
|------|--------|---------------|
| Exploratory (MS-track) | 500–1000 words | >1200 or <400 |
| Defined-agenda (PhD-adjacent) | 1000–2000 words | >2500 or <800 |

State the target word count at the top of the output.

If the draft falls outside the flag threshold, note it:
> "⚠️ Draft is [X] words — [over/under] the recommended range for [mode] mode. Consider
> [cutting/expanding] [paragraph]."

---

## Output

Save to `output/research-statement-{university-slug}-{YYYY-MM-DD}.md`.

```markdown
# Research Statement — {University}: {Program}

**Date:** {YYYY-MM-DD}
**Program type:** {Research-track / Professional-track}
**Mode:** {Defined-agenda / Exploratory}
**Target word count:** {range}
**Actual word count:** {N}
**Based on report:** {###} or "no evaluation report"

---

{4-paragraph research statement}

---

⚠️ STOP — Review before copying to your application portal. Verify every claim
against your cv.md. Do not paste without reading.
```

---

## Rules

1. **NEVER cite metrics from memory.** All project names, dates, outcomes, and
   publications must come from `cv.md`.
2. **NEVER invent faculty names or research areas.** Use evaluation report Block E,
   the program faculty page (via WebSearch or Playwright), or the user's explicit input.
3. **NEVER submit or copy to any portal.** Generate and stop. The applicant decides.
4. **Always end with the mandatory STOP notice** (see Output section above).
5. **Warn before proceeding** if `cv.md` shows minimal research experience — the user
   should make an informed choice about whether this document is appropriate.
6. **Do not conflate research statement with SOP.** If the user needs both, this mode
   generates the research statement only. Direct them to `/career-ops sop` for the SOP.
