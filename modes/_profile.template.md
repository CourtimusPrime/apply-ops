# User Profile Context -- masters-ops

<!-- ============================================================
     THIS FILE IS YOURS. It will NEVER be auto-updated.

     Customize everything here: your program-type archetypes,
     academic narrative, application strategy, funding targets,
     and location policy.

     The system reads _shared.md (updatable) first, then this
     file (your overrides). Your customizations always win.
     ============================================================ -->

## Your Target Programs

<!-- Replace these with YOUR target program types. Examples:
     - Research-track MS (thesis-focused, path to PhD)
     - Professional MS (coursework-heavy, industry entry)
     - Interdisciplinary MS (cross-department, applied focus)
     - Conversion degree (entering a new field)
     - Part-time / Online MS (alongside work)
     Whatever you're optimizing for. -->

| Program Type | Thematic axes | What they value in applicants |
|--------------|---------------|-------------------------------|
| **Research-track MS** | Thesis, faculty mentorship, lab fit, publication potential | Someone with research experience, clear intellectual curiosity, and a faculty match |
| **Professional MS** | Coursework, industry projects, career services, alumni network | Someone with practical skills, clear career goals, and industry-relevant experience |
| **Interdisciplinary MS** | Applied problems, cross-department collaboration, real-world impact | Someone who bridges domains and frames research around concrete outcomes |
| **Conversion degree** | Foundations, academic potential, motivation to switch fields | Someone with strong fundamentals in adjacent areas and a compelling story for the pivot |
| **Part-time / Online MS** | Flexibility, self-direction, professional experience | Someone with work experience who can articulate why they need the credential now |

## Your Adaptive Framing

<!-- Map YOUR projects and strengths to each program type. Example:
     | Research-track | My NLP lab work + publication | cv.md + article-digest.md |
     | Professional   | My production ML system       | cv.md section 3           | -->

| If the program is... | Emphasize about you... | Proof point sources |
|----------------------|------------------------|---------------------|
| Research-track MS | Research experience, faculty alignment, thesis topic idea | article-digest.md + cv.md |
| Professional MS | Production systems, industry impact, career trajectory | cv.md + article-digest.md |
| Interdisciplinary MS | Cross-domain thinking, applied outcomes, collaboration | article-digest.md + cv.md |
| Conversion degree | Adjacent foundations, learning velocity, compelling pivot story | cv.md + article-digest.md |
| Part-time / Online MS | Work experience, professional goals, self-direction | cv.md + article-digest.md |

## Your Academic Narrative

<!-- Replace with YOUR story. This frames everything in SOPs and cover emails. -->

Use the candidate's academic story from `config/profile.yml` to frame ALL content:
- **In SOP drafts:** Open with intellectual journey, not just credentials
- **In research statements:** Bridge past projects to proposed thesis direction
- **In email outreach to faculty:** Lead with specific alignment to their work, then your background

## Your Cross-cutting Strength

<!-- What's your "signature move"? What research angle or skill do you have that others lack? -->

Frame profile as **"[Your unique combo]"** that adapts emphasis to program type.

## Your Portfolio / Research Page

<!-- If you have a research page, GitHub, or demo:
     url: https://yoursite.dev/research
     when_to_share: "Research-track MS applications, faculty cold emails" -->

If you have a portfolio or research page (check profile.yml), link it in SOP footers and faculty emails for relevant program types.

## Your Funding Targets

<!-- Research funding ranges for YOUR target programs and fields -->

**General guidance:**
- Use WebSearch for current funding data (program websites, PhD Stipends, GradCafe)
- Frame funding by program type and field, not just rankings
- Research assistantships (RA) often pay more than TAs but depend on faculty grants
- Fellowship deadlines often precede admission deadlines — flag these early

**From profile.yml:** Use `funding.target` and `funding.annual_cost_ceiling` to flag programs
that would require self-funding above the ceiling as a cost dimension in evaluations.

## Your Application Strategy

<!-- Adapt to YOUR situation: timeline, reach/target/safety split, geographic constraints -->

**Communicating funding needs:**
> "I'm targeting funded positions (fellowship, TA, or RA). I'm happy to discuss how I can contribute to the lab — teaching and research assistance are both areas I'm interested in."

**When asked about fit with an unfunded program:**
> "I'm drawn to [program] because of [specific reason]. I'm actively exploring all funding options including external fellowships — can you tell me more about what's typically available to incoming students?"

**When following up after a long wait:**
> "I wanted to check in on my application status. I remain very interested in [program] and would love to connect if there's an opportunity to speak with faculty or current students."

## Your Location Policy

<!-- Adapt to YOUR situation -->

**In application forms:**
- Follow your actual availability from profile.yml
- Specify relocation willingness in free-text fields

**In evaluations (scoring):**
- Remote/hybrid MS programs: score based on your `location.remote_ok` preference from profile.yml
- Only score low if program requires full on-site attendance you cannot accommodate
