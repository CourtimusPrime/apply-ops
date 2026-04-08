# Mode: pipeline — URL Inbox

Processes program URLs accumulated in `data/pipeline.md`. The user adds URLs at any time and then runs `/career-ops pipeline` to process them all.

## Workflow

1. **Read** `data/pipeline.md` → find `- [ ]` items in the "Pending" section.
2. **For each pending URL:**
   a. Calculate the next sequential `REPORT_NUM` (read `reports/`, take the highest number + 1).
   b. **Extract program description** using Playwright (`browser_navigate` + `browser_snapshot`) → WebFetch → WebSearch.
   c. If the URL is not accessible → mark as `- [!]` with a note and continue.
   d. **Run the full auto-pipeline:** Evaluation A–F → Report .md → PDF (if score ≥ 3.0) → Tracker.
   e. **Move from "Pending" to "Processed":** `- [x] #NNN | URL | University | Program | Score/5 | PDF ✅/❌`
3. **If there are 3+ pending URLs**, launch agents in parallel (Agent tool with `run_in_background`) to maximize throughput.
4. **When done**, display a summary table:

```
| # | University | Program | Score | PDF | Action |
```

## Format of pipeline.md

```markdown
## Pending
- [ ] https://apply.mit.edu/programs/ms-cs
- [ ] https://grad.stanford.edu/apply/cs-ms | Stanford | MS Computer Science
- [!] https://private.portal/apply — Error: login required

## Processed
- [x] #143 | https://apply.mit.edu/programs/ms-cs | MIT | MS CS | 4.2/5 | PDF ✅
- [x] #144 | https://grad.stanford.edu/apply/cs-ms | Stanford | MS CS | 3.8/5 | PDF ✅
```

## Program Description Extraction

1. **Playwright (preferred):** `browser_navigate` + `browser_snapshot`. Works with all SPAs.
2. **WebFetch (fallback):** For static pages or when Playwright is unavailable.
3. **WebSearch (last resort):** Search for program on secondary aggregator sites.

**Special cases:**
- **Login-gated portals** (Slate, ApplyTexas): mark `[!]` and ask the user to paste the description.
- **PDF links:** Read directly with the Read tool.
- **`local:` prefix:** Read the local file. Example: `local:programs/mit-ms-cs.md` → read `programs/mit-ms-cs.md`.

## Automatic Numbering

1. List all files in `reports/`.
2. Extract the number prefix (e.g., `142-mit-ms-cs-2026-04-08.md` → 142).
3. New number = highest found + 1.

## Source Sync Check

Before processing any URL, verify sync:
```bash
node cv-sync-check.mjs
```
If there is a desync, warn the user before continuing.
