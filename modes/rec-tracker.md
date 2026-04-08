# Mode: rec-tracker — Recommendation Letter Tracker

<!-- ============================================================
     SYSTEM FILE — auto-updatable. Do not put personal data here.
     User customizations → modes/_profile.md or config/profile.yml
     ============================================================ -->

## Trigger

User says "show rec status", "update rec tracker", "who hasn't submitted yet",
"add [name] as a recommender", "mark [name] as submitted for [program]", or the
program evaluation mode reminds the user to update their rec tracker.

---

## Pre-flight

1. Read `data/recommendations.md`
2. If the file doesn't exist:
   - Create it with the empty header structure (see below)
   - Prompt the user:
     > "I've created `data/recommendations.md`. Add your recommenders by telling me:
     > - Recommender name and role (e.g., 'Prof. Jane Smith — PhD advisor')
     > - Their email address
     > - Which programs you're asking them to write for
     > - Any relevant deadlines"

---

## Canonical Statuses

| Status | Meaning |
|--------|---------|
| `Pending Ask` | Haven't asked yet — thinking about it or waiting for the right moment |
| `Agreed` | They said yes; letter not yet submitted to any portal |
| `Submitted` | Confirmed submitted via the program's portal |
| `Waived` | Applicant has waived the right to view this letter |

---

## Default Display

When the user asks for rec status (or no specific operation is requested), show:

```
## Recommendation Letter Status — {today's date}

### 🔴 Urgent (Agreed — deadline ≤ 14 days)
| Recommender | Program | Deadline | Days Left | Notes |
|-------------|---------|----------|-----------|-------|
(rows from data/recommendations.md matching: status = Agreed AND deadline ≤ 14 days from today)

### 📋 Active
| Recommender | Role | Programs | Status | Next Deadline |
|-------------|------|----------|--------|--------------|
(all recommenders with status Pending Ask or Agreed, sorted by next deadline)

### ✅ Complete
(recommenders with all letters Submitted, grouped by recommender name)

### Summary
- {N} recommenders total
- {N} letters agreed (not yet submitted)
- {N} letters submitted
- {N} programs with at least one letter confirmed
```

If no recommenders have been added yet, skip the tables and show only the Summary
with all zeros, and prompt the user to add their first recommender.

---

## Supported Operations

### Add recommender

User provides name, role, email → append a new row to `data/recommendations.md`.
Default status: `Pending Ask`.

Confirm: "Added [Name] ([Role]) to the rec tracker with status `Pending Ask`."

### Add program to recommender

User says "add [University] to [Recommender name]" → find the recommender's row and
append the university to the Programs Requested cell (comma-separated).

Confirm: "Added [University] to [Name]'s program list. They're now covering: [list]."

### Update status

User says "[Name] submitted for [University]" or "mark [Name] as agreed" →
update the Status cell for that recommender (or the relevant program entry if tracking
per-program).

Confirm: "Updated [Name]'s status to `Submitted` for [University]."

### Show warnings

Scan `data/recommendations.md` for:
- Status = `Agreed` AND deadline ≤ 14 days from today → 🔴 Urgent
- Status = `Pending Ask` AND deadline ≤ 21 days from today → ⚠️ Ask soon
- Programs with no recommender covering them → flag the gap

---

## File Format (`data/recommendations.md`)

```markdown
# Recommendation Letter Tracker

| Recommender | Role | Email | Programs Requested | Status | Deadline | Notes |
|-------------|------|-------|-------------------|--------|----------|-------|
```

- **Recommender:** Full name
- **Role:** e.g., "PhD advisor", "Industry manager", "Course instructor"
- **Email:** Used for tracking only — never auto-sent
- **Programs Requested:** Comma-separated list of university short names (e.g., "MIT, Stanford, CMU")
- **Status:** One of the canonical statuses above
- **Deadline:** Earliest deadline among requested programs (YYYY-MM-DD), or `rolling`, or `—`
- **Notes:** Any context useful for tracking (e.g., "prefers 3-week notice", "only 2 letters max")

---

## Rules

1. **NEVER send emails, draft outreach, or contact recommenders** — not even drafts.
   The rec tracker only tracks status. The applicant manages the relationship.
2. **If the user asks to draft an email to a recommender**, redirect:
   > "The rec tracker doesn't handle outreach. If you want to draft a reminder or
   > initial ask, paste the context (their name, your relationship, the programs) and
   > I can help you write it as a one-off task — but I won't initiate contact or
   > schedule anything automatically."
3. **Edit `data/recommendations.md` directly** for all status updates. This is a
   user-layer data file — treat it with the same care as `data/applications.md`.
4. **NEVER auto-create `data/recommendations.md`** without notifying the user (see
   Pre-flight step 2).
5. **Deadlines are the applicant's responsibility.** The tracker flags urgency but
   does not follow up or remind on a schedule.
