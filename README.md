# apply-ops

A fork of [career-ops](https://github.com/santifer/career-ops) adapted for applying to master's degree programs.

The original system was built to manage job searches. This fork repurposes it for graduate school: evaluating programs, generating academic CVs, tracking applications, and cold-emailing faculty.

---

## What It Does

- **Evaluates programs** with a structured scoring system against your academic profile
- **Generates academic CVs** as ATS-optimized PDFs tailored per program
- **Scans universities** for new programs matching your research interests
- **Processes in batch** — evaluate multiple programs in parallel
- **Tracks everything** in a single source of truth with integrity checks

> **This is not a spray-and-pray tool.** It helps you find programs worth applying to, not blast every school in sight. The system strongly recommends against applying to anything scoring below 4.0/5. Your time matters, and so does the admissions committee's.

## Quick Start

```bash
# 1. Clone and install
git clone <this-repo>
cd apply-ops && npm install
npx playwright install chromium   # Required for PDF generation

# 2. Check setup
npm run doctor

# 3. Configure
cp config/profile.example.yml config/profile.yml  # Edit with your details

# 4. Add your CV
# Create cv.md in the project root with your CV in markdown

# 5. Open Claude Code in this directory
claude

# Claude will guide you through onboarding on first run.
# Then paste a program URL or run /apply-ops to see all commands.
```

See [docs/SETUP.md](docs/SETUP.md) for the full setup guide.

## Usage

```
/apply-ops                   → Show all available commands
/apply-ops {paste a URL}     → Full auto-pipeline (evaluate + PDF + tracker)
/apply-ops scan              → Scan universities for new programs
/apply-ops pdf               → Generate academic CV PDF
/apply-ops batch             → Batch evaluate multiple programs
/apply-ops tracker           → View application status
/apply-ops apply             → Fill application forms with AI
/apply-ops pipeline          → Process pending URLs from inbox
/apply-ops contacto          → Cold email to faculty
/apply-ops deep              → Deep program + faculty research
/apply-ops sop               → Draft statement of purpose
/apply-ops rec-tracker       → Track recommendation letters
```

Or just paste a program URL or description — apply-ops auto-detects it and runs the full pipeline.

## Project Structure

```
apply-ops/
├── CLAUDE.md                    # Agent instructions
├── cv.md                        # Your CV (create this)
├── article-digest.md            # Your proof points (optional)
├── config/
│   └── profile.example.yml      # Template for your profile
├── modes/                       # Skill modes
│   ├── _shared.md               # Shared context
│   ├── _profile.md              # Your customizations (never overwritten)
│   ├── oferta.md                # Single program evaluation
│   ├── pdf.md                   # PDF generation
│   ├── scan.md                  # University scanner
│   ├── batch.md                 # Batch processing
│   └── ...
├── templates/
│   ├── cv-template.html         # ATS-optimized CV template
│   └── states.yml               # Canonical statuses
├── universities.yml             # University and program config
├── data/                        # Your tracking data (gitignored)
├── reports/                     # Evaluation reports (gitignored)
├── output/                      # Generated PDFs (gitignored)
└── examples/                    # Sample CV, report, proof points
```

## Tech Stack

- **Agent**: Claude Code with custom skills and modes
- **PDF**: Playwright + HTML template
- **Scanner**: Playwright + WebSearch
- **Data**: Markdown tables + YAML config

## Upstream

This is a fork of [career-ops by santifer](https://github.com/santifer/career-ops). The original system targets job searches; this fork adapts the archetypes, scoring logic, and modes for graduate school applications. System updates from upstream can be applied with `node update-system.mjs apply`.

## Disclaimer

apply-ops is a local, open-source tool — not a hosted service. Your CV and personal data stay on your machine and are sent directly to the AI provider you choose. The tool never submits applications — you always have the final call. See [LEGAL_DISCLAIMER.md](LEGAL_DISCLAIMER.md) for full details.

## License

MIT
