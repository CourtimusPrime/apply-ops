# PRD: Convert apply-ops to a Masters Degree Application System

## Introduction

apply-ops is a mature AI job-search pipeline: it scans portals, evaluates job
offers with structured scoring, generates tailored CVs, tracks applications, and
assists with live application forms. This PRD covers the work needed to
repurpose it for graduate school applications — specifically undergrad students
applying to taught masters programs. The underlying infrastructure (Node
scripts, Playwright, tracker, report numbering, pipeline inbox, batch
processing) is retained unchanged. Only the domain-specific content and modes
need to change.

**Scope:** Core modes only — program evaluation, university scanner, application
materials generation, and the live apply assistant. Spanish/French/German
locales are out of scope for now.

---

## Goals

- Replace every job-specific concept with its graduate-school equivalent while
  keeping the system's proven architecture intact.
- Give applicants a structured evaluation of each program they consider, with a
  clear fit score and a concrete application strategy.
- Generate a full application materials package per program: tailored SOP,
  academic CV, research statement, writing sample guidance, and recommendation
  letter tracker.
- Scan configured university program pages for new openings and deadlines.
- Assist with live form-filling on graduate application portals.
- Track all programs in a single applications tracker from first evaluation
  through admission decision.

---

## User Stories

### US-001: Academic Profile Setup (profile.yml + _profile.md)

**Description:** As an applicant, I want to configure my academic background
once so the system can evaluate programs and generate tailored materials from a
single source of truth.

**Acceptance Criteria:**

- [ ] `config/profile.example.yml` is rewritten with graduate-school fields:
      GPA, test scores (GRE/GMAT/TOEFL), undergraduate institution, field,
      graduation year, research interests, publications/projects, intended field
      of study, funding preferences
- [ ] `compensation` block is replaced with `funding` block: target (fellowship
      / TA/RA / self-funded / any), annual cost ceiling, preferred currency
- [ ] `target_roles` block is replaced with `target_programs` block: degree type
      (MSc, MEng, MCS, MBA), field, preferred program style (research-track vs.
      professional-track)
- [ ] `modes/_profile.template.md` archetypes table is rewritten for program
      types (research-track MS, professional MS, interdisciplinary, conversion
      degree, part-time/online)
- [ ] Framing table maps each program type to which academic strengths to
      foreground
- [ ] Onboarding flow in `CLAUDE.md` asks for academic profile fields instead of
      job search fields
- [ ] Existing `config/profile.yml` and `modes/_profile.md` (if present) are not
      touched

---

### US-002: Academic CV Mode

**Description:** As an applicant, I want to generate an academic CV (distinct
from a professional résumé) tailored to each program type.

**Acceptance Criteria:**

- [ ] `modes/pdf.md` is updated (or a new `modes/academic-cv.md` created) with
      an academic CV layout: Education first, then Research Experience,
      Publications/Preprints, Projects, Teaching/TA, Awards & Honors, Skills,
      then Work Experience
- [ ] Section ordering adapts per program type: research-track programs
      foreground research and publications; professional-track programs
      foreground projects and skills
- [ ] GPA and test score formatting rules are explicit (when to include, how to
      format)
- [ ] The HTML CV template (`templates/cv-template.html`) renders academic
      sections correctly
- [ ] `generate-pdf.mjs` continues to work unchanged
- [ ] Generated PDF is saved to `output/` as before

---

### US-003: Program Evaluation Mode (replaces oferta.md)

**Description:** As an applicant, I want to paste a university program URL or
description and receive a structured evaluation with a fit score and application
strategy.

**Acceptance Criteria:**

- [ ] `modes/oferta.md` is replaced by `modes/program.md` with 6 evaluation
      blocks:
  - **A) Program Summary** — degree type, field, university, location, format
    (on-campus/online/hybrid), program length, intake deadline, ranking signal
  - **B) Academic Fit** — map applicant's GPA, test scores, research interests,
    and projects against stated requirements and faculty research directions;
    flag gaps with mitigation plans
  - **C) Program Type & Strategy** — detect if research-track or
    professional-track; advise how to position the applicant's profile for that
    type; flag if applicant is over/under-qualified
  - **D) Funding & Cost** — tuition, typical funding packages (fellowships,
    RA/TA), cost of living, net annual cost estimate using WebSearch
  - **E) Application Materials Plan** — per-program tailoring: which research
    interests to foreground in SOP, which projects to cite, which faculty to
    name-check, cover letter angle
  - **F) Interview / Visit Day Prep** — if the program interviews, likely
    question types and recommended framing; if no interview, skip with a note
- [ ] Scoring uses 5 dimensions: Academic Fit, Research/Career Fit, Funding,
      Program Quality, Red Flags — producing a 1–5 global score
- [ ] Score thresholds are documented: 4.5+ = strong fit, apply now; 4.0–4.4 =
      good fit; 3.5–3.9 = borderline; below 3.5 = recommend against
- [ ] Post-evaluation: saves report to
      `reports/{###}-{university-slug}-{YYYY-MM-DD}.md` with same numbering
      convention
- [ ] Post-evaluation: writes TSV to `batch/tracker-additions/` (never edits
      `applications.md` directly)
- [ ] `modes/_shared.md` scoring table is updated for the 5 academic dimensions

---

### US-004: Statement of Purpose (SOP) Mode

**Description:** As an applicant, I want to draft and tailor a Statement of
Purpose for each program, grounded in my academic profile and the program's
specific faculty and research focus.

**Acceptance Criteria:**

- [ ] New `modes/sop.md` mode created
- [ ] SOP reads `cv.md`, `config/profile.yml`, `modes/_profile.md`, and the
      program's evaluation report (if it exists in `reports/`)
- [ ] SOP structure: opening hook (why this field), academic journey and
      preparation, specific research interests and how they align with the
      program's faculty, what the applicant will contribute, career goals
      post-degree, close
- [ ] Faculty name-checking: for research-track programs, SOP mentions 2–3
      specific faculty by name with their research mapped to the applicant's
      interests
- [ ] Word count and tone adapt per program type (research SOPs are more
      technical; professional-track SOPs are more project-and-outcome focused)
- [ ] Output is saved to `output/sop-{university-slug}-{YYYY-MM-DD}.md` for
      review
- [ ] System never submits — always stops and prompts user to review before
      copying

---

### US-005: Research Statement Mode

**Description:** As an applicant targeting research-track programs, I want to
draft a focused research statement that describes my proposed research
direction.

**Acceptance Criteria:**

- [ ] New `modes/research-statement.md` mode created
- [ ] Reads applicant's research experience from `cv.md` and
      `config/profile.yml`
- [ ] Structure: prior research experience and outcomes, open research question
      the applicant wants to pursue, proposed methodology or approach, why this
      program/faculty is the right environment
- [ ] Adapts specificity based on whether the applicant has a defined research
      agenda (PhD-track) or a general interest (MS-track)
- [ ] Word count guidance is explicit (typically 500–1000 words for MS; up to
      2000 for PhD-adjacent programs)
- [ ] Output saved to
      `output/research-statement-{university-slug}-{YYYY-MM-DD}.md`

---

### US-006: Recommendation Letter Tracker

**Description:** As an applicant, I want to track the status of recommendation
letters across all programs so I never miss a deadline.

**Acceptance Criteria:**

- [ ] New `data/recommendations.md` file created during onboarding with columns:
      Recommender | Role | Email | Programs Requested | Status | Deadline |
      Notes
- [ ] Canonical recommender statuses defined: `Pending Ask`, `Agreed`,
      `Submitted`, `Waived`
- [ ] New `modes/rec-tracker.md` mode: lists all recommenders, their status per
      program, and flags any recommender whose deadline is within 14 days with a
      status of `Agreed` (not yet `Submitted`)
- [ ] When the applicant runs a program evaluation, the system reminds them to
      add the program to `data/recommendations.md` for each recommender they
      plan to use
- [ ] The tracker does not send emails or automate outreach — it only tracks
      status

---

### US-007: Writing Sample Guidance Mode

**Description:** As an applicant, I want guidance on selecting and preparing a
writing sample for programs that require one.

**Acceptance Criteria:**

- [ ] New `modes/writing-sample.md` mode created
- [ ] Reads the program's requirements from the evaluation report (if exists) or
      from a URL/description provided by the user
- [ ] Evaluates candidate writing samples described by the user against the
      program's stated requirements and research focus
- [ ] Outputs: which sample to use, what to revise, how to frame it in the
      submission portal
- [ ] Explicitly advises on academic integrity: no AI-generated content in the
      writing sample, no third-party editing beyond proofreading

---

### US-008: University Program Scanner (replaces scan.md + portals.yml)

**Description:** As an applicant, I want the system to scan tracked university
program pages and surface new openings or deadline reminders.

**Acceptance Criteria:**

- [ ] `templates/portals.example.yml` is replaced or supplemented with
      `templates/universities.example.yml` with fields: `university`, `program`,
      `department`, `url`, `deadline`, `portal_type` (custom/ApplyTexas/etc.),
      `enabled`, `notes`
- [ ] `modes/scan.md` is updated to navigate tracked university program pages
      with Playwright and extract: program name, application deadline,
      open/closed status
- [ ] Title filter logic is replaced with field/department keyword filter (e.g.,
      positive: ["Computer Science", "Machine Learning", "Data Science"])
- [ ] Scan output highlights programs whose deadline is within 60 days
- [ ] Programs already in `data/pipeline.md` or `data/applications.md` are
      deduplicated as before
- [ ] Scan history in `data/scan-history.tsv` continues to work with same TSV
      format

---

### US-009: Application Tracker States (replaces states.yml)

**Description:** As an applicant, I want the tracker to reflect graduate
application lifecycle states rather than job application states.

**Acceptance Criteria:**

- [ ] `templates/states.yml` is updated with graduate school states:
      `Evaluated`, `In Progress`, `Submitted`, `Under Review`, `Interview`,
      `Admitted`, `Waitlisted`, `Rejected`, `Committed`, `Declined`, `SKIP`
- [ ] `normalize-statuses.mjs` handles new state aliases without breaking
      existing entries
- [ ] `data/applications.md` tracker gains a `Deadline` column (inserted after
      `Date`)
- [ ] `merge-tracker.mjs` and `dedup-tracker.mjs` continue to work with the
      updated column set
- [ ] `verify-pipeline.mjs` validates the new canonical states

---

### US-010: Live Apply Assistant (update apply.md)

**Description:** As an applicant filling out a graduate application portal, I
want real-time assistance generating answers to application questions.

**Acceptance Criteria:**

- [ ] `modes/apply.md` updated to handle graduate application form fields:
      personal statement short-answer, research interest statements, "why this
      program" prompts, diversity statements, financial aid questions, visa/work
      authorization, transcript upload reminders
- [ ] System loads the program's evaluation report and SOP draft (from
      `output/`) to inform answers
- [ ] System detects recommendation letter portals (e.g., "Your recommenders
      will receive an email") and reminds the user to update
      `data/recommendations.md`
- [ ] Post-apply: status updated to `Submitted` in tracker; deadline field
      marked as met
- [ ] System never clicks Submit — always stops before final submission

---

### US-011: Deep Research Mode for Programs (update deep.md)

**Description:** As an applicant, I want structured research on a university
program and its faculty before writing application materials.

**Acceptance Criteria:**

- [ ] `modes/deep.md` updated with 6 graduate-school research axes: (1) Faculty
      Research Directions, (2) Recent Admissions Data (acceptance rate, GPA/GRE
      medians if published), (3) Funding Landscape (typical packages, fellowship
      names, external fellowships accepted), (4) Alumni Outcomes (placements,
      industry vs. academia), (5) Program Reputation & Peers (ranking context,
      competitor programs), (6) Applicant Angle (how this applicant's profile
      maps to the program's stated needs)
- [ ] Output is a structured research brief saved to
      `interview-prep/{university-slug}-{program-slug}.md` (reusing the same
      directory)
- [ ] WebSearch citations are required for all factual claims

---

### US-012: Professor Outreach Mode (update contacto.md)

**Description:** As an applicant targeting research-track programs, I want to
draft a cold email to a potential research supervisor before applying.

**Acceptance Criteria:**

- [ ] `modes/contacto.md` updated for professor cold email (replacing LinkedIn
      outreach)
- [ ] Email framework: (1) one sentence showing you have read their recent work,
      citing a specific paper or project; (2) your relevant background and
      research question; (3) a specific, narrow ask — not "can I join your lab"
      but "would you be open to a 20-minute call to discuss your work on X"
- [ ] Email length: 150–200 words maximum
- [ ] System identifies 2–3 relevant faculty from the evaluation report (Block
      B) or via WebSearch
- [ ] Output includes a primary target and 1–2 alternatives with rationale
- [ ] System reminds user: send only if the program explicitly encourages
      pre-application contact (many programs discourage it — check program
      website)

---

### US-013: Interview Prep Mode for Graduate Programs (update interview-prep.md)

**Description:** As an applicant invited to a program interview or visit day, I
want a structured prep guide.

**Acceptance Criteria:**

- [ ] `modes/interview-prep.md` updated for graduate admissions interviews:
      admissions committee interviews, faculty research interviews, video
      essays, open days
- [ ] Research step queries: program interview format (if documented), faculty
      research directions, "why this program" questions specific to this
      university
- [ ] Output covers: likely question types, how to frame the applicant's
      research interests, how to ask sharp questions about the program,
      visit-day logistics if applicable
- [ ] Story bank (`interview-prep/story-bank.md`) is repurposed for academic
      narrative stories rather than STAR work stories

---

### US-014: System Wiring & CLAUDE.md Update

**Description:** As a developer, I need the system instructions, mode routing
table, and onboarding flow to reflect the graduate school domain so the AI agent
routes correctly.

**Acceptance Criteria:**

- [ ] `CLAUDE.md` skill modes routing table updated: "pastes university URL" →
      program evaluation mode, "wants to write SOP" → SOP mode, "wants to scan
      programs" → scan mode, etc.
- [ ] Onboarding flow updated: asks for GPA, test scores, research interests
      instead of salary and job archetypes
- [ ] `auto-pipeline.md` updated to run program evaluation (not job evaluation)
      when a URL is added to pipeline
- [ ] All references to "job", "offer", "company", "JD", "salary", "archetype"
      in system files replaced with graduate-school equivalents
- [ ] `cv-sync-check.mjs` check updated to validate academic profile fields
      instead of job fields (or skipped if not applicable)
- [ ] Data contract section in `CLAUDE.md` updated to reflect new user-layer
      files (`data/recommendations.md`)

---

## Functional Requirements

- **FR-1:** The system must read `config/profile.yml` academic fields (GPA, test
  scores, research interests) before every program evaluation.
- **FR-2:** Every program evaluation must produce a report in `reports/` and a
  TSV entry in `batch/tracker-additions/` — the same pipeline integrity rules as
  job evaluations.
- **FR-3:** The SOP, research statement, and academic CV must be generated from
  `cv.md` and `config/profile.yml` — never from hardcoded data.
- **FR-4:** The scanner must respect application deadlines: programs within 60
  days of deadline must be flagged prominently in scan output.
- **FR-5:** The system must never submit an application on behalf of the user —
  always stop before the final submit action.
- **FR-6:** Every generated application material (SOP, research statement, cover
  letter) must explicitly cite which sections of `cv.md` or `profile.yml` it
  drew from, so the user can verify accuracy.
- **FR-7:** The recommendation letter tracker must warn the user if a
  recommender has status `Agreed` and the program deadline is within 14 days.
- **FR-8:** `normalize-statuses.mjs`, `merge-tracker.mjs`, `dedup-tracker.mjs`,
  and `verify-pipeline.mjs` must all pass without error after tracker state
  changes.
- **FR-9:** All modes generate output in English (locale variants are out of
  scope).
- **FR-10:** The `generate-pdf.mjs` script must remain unchanged; only the HTML
  template input changes.

---

## Non-Goals (Out of Scope)

- **No PhD application support** — this system targets taught masters programs
  only. PhD applications (research proposals, funding applications, advisor
  negotiation) are a different workflow.
- **No application portal automation** — the system assists with filling forms
  but does not automate navigation of ApplyTexas, UCAS, or university-specific
  portals. Users fill forms manually; the system generates the answers.
- **No automated recommendation letter requests** — the tracker records status,
  but the system does not draft or send emails to recommenders.
- **No scholarship/bursary discovery** — funding research (FR-4) covers what the
  program typically offers; it does not scan external scholarship databases.
- **No Spanish/French/German locale updates** — all `modes/de/`, `modes/fr/`,
  `modes/pt/` directories are left unchanged.
- **No changes to Node.js scripts** — `generate-pdf.mjs`, `merge-tracker.mjs`,
  `dedup-tracker.mjs`, `verify-pipeline.mjs`, `update-system.mjs` are
  infrastructure and remain unchanged unless a specific US requires it.
- **No job evaluation modes** — the original `oferta.md`, `training.md`,
  `project.md` modes are not kept; this is a clean conversion.

---

## Technical Considerations

- **File rename strategy:** `modes/oferta.md` → `modes/program.md`;
  `modes/contacto.md` updated in place; all others updated in place. No new
  directories needed.
- **Backward compatibility:** `data/applications.md` gains a `Deadline` column.
  If an existing tracker file exists, the new column is appended at position 3
  (after `Date`). `merge-tracker.mjs` must handle both old (8-column) and new
  (9-column) TSV formats during the transition.
- **portals.yml:** Rename to `universities.yml`. The scan mode reads
  `universities.yml`; the old `portals.yml` key is not used.
- **Report format:** Reports continue to use `{###}-{slug}-{YYYY-MM-DD}.md`
  naming. The slug changes from company to university program (e.g.,
  `001-mit-csail-ms-2026-04-08.md`).
- **cv.md:** The existing `cv.md` format is preserved. Academic CV sections
  (Publications, Research Experience) are added only if the user provides them.
  The system does not reformat an existing `cv.md` automatically.
- **No new Node dependencies** required for any of the above changes.

---

## Implementation Order (Suggested)

The stories are designed to be independent enough to plan and implement one at a
time. Suggested order minimizes blocking dependencies:

| Phase | Stories                                                                                      | Rationale                                                                     |
| ----- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 1     | US-001 (Profile)                                                                             | Foundation — everything else reads profile                                    |
| 2     | US-002 (Academic CV)                                                                         | Needed before materials generation                                            |
| 3     | US-003 (Program Evaluation)                                                                  | Core mode — drives report/tracker pipeline                                    |
| 4     | US-009 (Tracker States)                                                                      | Needed before any tracker entries are created                                 |
| 5     | US-004 (SOP), US-005 (Research Statement), US-006 (Rec Tracker), US-007 (Writing Sample)     | Application materials — independent of each other, can be planned in parallel |
| 6     | US-008 (Scanner)                                                                             | Discovery mode — needs universities.yml                                       |
| 7     | US-010 (Apply), US-011 (Deep Research), US-012 (Professor Outreach), US-013 (Interview Prep) | Supporting modes — independent                                                |
| 8     | US-014 (System Wiring)                                                                       | Final wiring — updates CLAUDE.md after all modes exist                        |

---

## Success Metrics

- An applicant can paste any university masters program URL and receive a
  complete evaluation report with a fit score in under 5 minutes.
- A tailored SOP draft for a given program is generated in under 2 minutes,
  grounded in the applicant's actual profile (no hallucinated credentials).
- The scanner identifies new program listings and deadline reminders without
  manual browsing.
- The recommendation letter tracker surfaces at-risk deadlines before they are
  missed.
- The full application materials package (SOP + academic CV + research
  statement) is generated for any evaluated program in a single session.

---

## Open Questions

1. Should `cv.md` be renamed `academic-cv.md` to make the domain change
   explicit, or should the filename stay the same to minimise changes to scripts
   and CLAUDE.md references?
2. Some programs use the same application portal for multiple departments (e.g.,
   a single Apply portal covers all grad programs at a university). Should
   `universities.yml` track programs or universities as the primary unit?
3. For the recommendation letter tracker: should it be a separate markdown file
   (`data/recommendations.md`) or a section appended to the existing
   `data/applications.md`?
4. Should the score threshold for auto-generating a SOP draft (equivalent to the
   current 4.5 threshold for Section G) be the same 4.5, or different?
