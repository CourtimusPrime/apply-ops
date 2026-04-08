# Mode: auto-pipeline — Full Evaluation Pipeline

When the user pastes a program URL or description without an explicit sub-command, execute the full pipeline in sequence:

## Step 0 — Extract Program Description

If the input is a **URL** (not pasted text), use this extraction strategy:

**Priority order:**

1. **Playwright (preferred):** University admissions portals, department pages, ApplyTexas, UCAS, Slate are often SPAs. Use `browser_navigate` + `browser_snapshot` to render and read the program page.
2. **WebFetch (fallback):** For static pages (department sites, older university portals).
3. **WebSearch (last resort):** Search program title + university name on secondary sites that index program descriptions in static HTML.

**If login is required:** Mark `[!]` and ask the user to paste the program description manually.

**If input is pasted text** (not a URL): use as-is, no fetch needed.

## Step 1 — Program Evaluation (A–F)

Run `modes/program.md` in full (all blocks A–F and global score).

## Step 2 — Save Report

Save the complete evaluation to `reports/{###}-{university-slug}-{YYYY-MM-DD}.md` (same naming convention as other reports).

## Step 3 — Academic CV PDF

Run the full `modes/pdf.md` pipeline (`node generate-pdf.mjs` is shared infrastructure — unchanged).

## Step 4 — Draft SOP (if score ≥ 4.0)

If the global score is ≥ 4.0:

1. Run `modes/sop.md` to draft a tailored Statement of Purpose.
2. Save the draft to `output/sop-{university-slug}-{YYYY-MM-DD}.md`.
3. Append a `## G) SOP Draft` section reference to the report.

For research-track programs, also offer to run `modes/research-statement.md`.

## Step 5 — Update Tracker

Write TSV to `batch/tracker-additions/` — **never edit `data/applications.md` directly**.
Mark status `Evaluated`. Include score, report link, and PDF status.

**If any step fails:** Continue with remaining steps. Mark the failed step as pending in the tracker notes.
