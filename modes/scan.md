# Mode: scan — Academic Program Scanner

Scans tracked graduate programs and runs discovery queries to surface new programs,
open application windows, and approaching deadlines.

## Execution

Run as a subagent to protect main context:

```
Agent(
    subagent_type="general-purpose",
    prompt="[contents of this file + specific data]",
    run_in_background=True
)
```

## Configuration

Read `universities.yml` (project root). If `universities.yml` is missing:

1. Check if `portals.yml` exists (old job-search config).
2. If `portals.yml` exists, warn:
   > "Found `portals.yml` (job search config) but no `universities.yml` (program config).
   > Copy `templates/universities.example.yml` to `universities.yml` and add your target
   > programs to enable scanning."
   Then stop — do not run the scan against `portals.yml`.
3. If neither file exists, prompt the user to copy the template and configure it.

## Pre-Scan Reads

Before scanning, read:

1. `universities.yml` — tracked programs and discovery queries
2. `data/scan-history.tsv` — URLs already seen (dedup)
3. `data/applications.md` — programs already in tracker (dedup)
4. `data/pipeline.md` — programs already pending evaluation (dedup)

## Scan Strategy

### Level 1 — Playwright direct (primary)

For each entry in `tracked_programs` with `enabled: true`:

1. `browser_navigate` to the `url`
2. `browser_snapshot` to read the page content
3. Extract:
   - Application open/closed status
   - Application deadline (compare against `universities.yml` value)
   - Notable updates: new requirements, new intake cycle, portal link changes
4. Classify the program:
   - **Open** — application portal active, deadline in the future
   - **Upcoming** — not yet open but deadline announced
   - **Closed** — current cycle closed (last intake passed or page explicitly says so)
   - **Unknown** — page lacks sufficient signal to classify
5. Flag if deadline ≤ 60 days from today
6. If not already in `data/applications.md` or `data/pipeline.md` → add to pipeline

If Playwright times out or returns 403/404: note it in output as
"Could not verify — check manually" and continue with remaining entries.

### Level 2 — WebSearch discovery (broad)

For each query in `search_queries` with `enabled: true`:

1. Execute WebSearch with the configured query
2. Extract program name, university, and URL from results
3. Apply `field_filter`:
   - At least one `positive` keyword must match the program title (case-insensitive)
   - Zero `negative` keywords may match the program title (case-insensitive)
   - Field filter is NOT applied to `tracked_programs` (already vetted)
4. Dedup against `scan-history.tsv`, `applications.md`, and `pipeline.md`
5. For each new result: Playwright verify (navigate + snapshot) before adding to pipeline

**Playwright liveness check for WebSearch results:**
Navigate to each URL and snapshot. If the page is closed, 404, or shows only
navigation without program content → record in `scan-history.tsv` as `skipped_expired`
and do not add to pipeline.

## Dedup Logic

Skip a result if it matches any of:

- `data/scan-history.tsv` — exact URL match
- `data/applications.md` — university + program match (normalized, case-insensitive)
- `data/pipeline.md` — exact URL match

## scan-history.tsv Format

The TSV schema is unchanged from the job scanner for compatibility:

```
url	first_seen	portal	title	company	status
```

For the academic scanner:
- `title` column → program name (e.g., "MSc Computer Science")
- `company` column → university short name (e.g., "MIT")
- `portal` column → portal_type from `universities.yml` (e.g., "Slate", "custom")
- `status` column → `added`, `skipped_expired`, `duplicate`, or `already_tracked`

## Add to pipeline.md

Append one line per new program:

```
- [ ] {url} | {university} | {program}
```

This format is compatible with `/apply-ops program` (the program evaluation mode).

## Deadline Management

If a Playwright snapshot reveals a deadline different from the value in `universities.yml`:

1. Note the discrepancy in the scan output
2. Recommend the user update `universities.yml` manually

Do NOT auto-update `universities.yml` — it is a user-layer config file.

## Output Format

```
Program Scan — {YYYY-MM-DD}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tracked programs checked: N
Discovery queries run: N

⏰ Approaching deadline (≤ 60 days):
  [university] | [program] | Deadline: YYYY-MM-DD (N days)
  ...

🆕 New programs added to pipeline:
  [university] | [program] | {url}
  ...

✅ Already tracked (skipped): N
❌ Closed or inactive (skipped): N
🔁 Duplicates (skipped): N
⚠️  Could not verify (check manually): N

→ Run /apply-ops pipeline to evaluate new programs.
```

If no new programs were found, say so explicitly — do not silently succeed.

## Global Rules

1. NEVER auto-update `universities.yml` or any user-layer file without explicit instruction.
2. NEVER run the scan against `portals.yml` (job-search config) — detect and warn.
3. Always verify WebSearch results with Playwright before adding to pipeline.
4. Dedup against all three sources (scan-history, applications, pipeline) before writing.
5. If Playwright fails on a tracked program: note it in output and continue.
6. Do not add programs with `enabled: false` to the scan queue.
