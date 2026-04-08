# Mode: pdf — Academic CV Generation

## Pipeline

1. Read `cv.md` as source of truth for all CV content.
2. Read `config/profile.yml` for academic profile fields: name, email, location, GPA, test scores, research interests, GitHub, portfolio URL.
3. Read `modes/_profile.md` for program-type framing and target context.
4. If the target university slug and program type are not already in context, ask:
   > "Which university and program is this CV for? (e.g., `mit-csail`, `stanford-ee`) And is the program research-track or professional-track? I'll use this for the filename and section ordering."
5. Detect program type → set section order:
   - **Research-track**: Education → Research Experience → Publications → Research Projects → Teaching & Service → Awards & Honors → Skills → Work Experience (if present)
   - **Professional-track**: Education → Work Experience → Research Projects → Publications (if any) → Skills → Teaching & Service (if any) → Awards & Honors
   - **Default (unknown)**: Use research-track order
6. Write Academic Summary (2–4 sentences): research interests + degree goal + one concrete proof point from cv.md. No JD keywords — this is about fit with the field, not a specific posting.
7. Build Research Interests grid from `profile.yml` → `academic_profile.research_interests`. Render as `<span class="competency-tag">interest</span>` tags.
8. Populate each section from `cv.md` content — no keyword injection, no reformulation. Apply GPA and test score formatting rules (see below) to the Education entry.
9. Detect location from `profile.yml` → paper format:
   - US/Canada → `letter`
   - Rest of world → `a4`
10. Generate full HTML from `templates/cv-template.html`, filling all placeholders. Use empty string `""` for any optional section with no content — never leave a `{{...}}` placeholder in the output.
11. Write HTML to `/tmp/academic-cv-{candidate-slug}-{university-slug}.html`
12. Run:
    ```
    node generate-pdf.mjs /tmp/academic-cv-{candidate-slug}-{university-slug}.html output/cv-{candidate-slug}-{university-slug}-{YYYY-MM-DD}.pdf --format={letter|a4}
    ```
13. Report: PDF path, page count, and a checklist of sections included (✅ present / — omitted).

## GPA Formatting Rules

- Include if GPA ≥ 3.5/4.0 (or equivalent strong result on other scales).
- Format: `GPA: X.X / 4.0` in the Education entry line.
- If `gpa_context` is set in profile.yml, add as parenthetical: `GPA: 3.7 / 4.0 (upward trend)`.
- If GPA < 3.5 or not set: omit silently unless the user explicitly asks to include it.

## Test Score Formatting Rules

- Include GRE if `gre_quant ≥ 165` OR `gre_verbal ≥ 160`; omit otherwise (low scores hurt more than they help).
- Format: `GRE: V162 / Q168 / AW4.5`
- Include TOEFL/IELTS only if score is strong (TOEFL ≥ 105, IELTS ≥ 7.0) or the target program explicitly requires it.
- Test scores go at the end of the Education entry — not in a separate section.

## Template Placeholder Mapping

| Placeholder | Academic meaning |
|-------------|-----------------|
| `{{LANG}}` | `en` |
| `{{PAGE_WIDTH}}` | `8.5in` (letter) or `210mm` (A4) |
| `{{NAME}}` | Candidate full name (from profile.yml) |
| `{{EMAIL}}` | Email (from profile.yml) |
| `{{LINKEDIN_URL}}` | LinkedIn URL (from profile.yml) |
| `{{LINKEDIN_DISPLAY}}` | LinkedIn display text (from profile.yml) |
| `{{GITHUB_URL}}` | GitHub profile URL (from profile.yml — preferred over portfolio for academic CVs) |
| `{{GITHUB_DISPLAY}}` | GitHub display text (e.g., `github.com/username`) |
| `{{LOCATION}}` | Location (from profile.yml) |
| `{{SECTION_SUMMARY}}` | "Academic Summary" |
| `{{SUMMARY_TEXT}}` | 2–4 sentence research summary |
| `{{SECTION_COMPETENCIES}}` | "Research Interests" |
| `{{COMPETENCIES}}` | `<span class="competency-tag">interest</span>` tags from profile.yml |
| `{{SECTION_EDUCATION}}` | "Education" |
| `{{EDUCATION}}` | Degree entry with GPA and test scores per formatting rules above |
| `{{SECTION_RESEARCH}}` | "Research Experience" |
| `{{RESEARCH}}` | Research roles and lab positions from cv.md (empty string if none) |
| `{{SECTION_EXPERIENCE}}` | "Work Experience" |
| `{{EXPERIENCE}}` | Work history — include only if non-research work is present and relevant (empty string otherwise) |
| `{{SECTION_PUBLICATIONS}}` | "Publications & Preprints" |
| `{{PUBLICATIONS}}` | Formatted publication list (empty string if none) |
| `{{SECTION_PROJECTS}}` | "Research Projects" |
| `{{PROJECTS}}` | Top 3–4 relevant projects from cv.md |
| `{{SECTION_TEACHING}}` | "Teaching & Service" |
| `{{TEACHING}}` | TA roles, tutoring, and academic service (empty string if none) |
| `{{SECTION_CERTIFICATIONS}}` | "Awards & Honors" |
| `{{CERTIFICATIONS}}` | Fellowships, scholarships, prizes (empty string if none) |
| `{{SECTION_SKILLS}}` | "Skills" |
| `{{SKILLS}}` | Technical and language skills |

**Contact row GitHub logic:** Use `{{GITHUB_URL}}` / `{{GITHUB_DISPLAY}}` if GitHub is present in profile.yml. Fall back to portfolio URL if GitHub is not set. Omit that slot entirely (including its separator) if neither is available.

## Design Reference

- **Fonts**: Space Grotesk (headings, 600–700) + DM Sans (body, 400–500), self-hosted in `fonts/`
- **Header**: name in Space Grotesk 28px bold + gradient line + contact row
- **Section headers**: Space Grotesk 12px, uppercase, letter-spacing 0.06em, cyan primary
- **Body**: DM Sans 11px, line-height 1.5
- **Margins**: 0.6in
- **Background**: white

## Post-Generation

Update tracker if the program is already registered: change PDF column from ❌ to ✅.
