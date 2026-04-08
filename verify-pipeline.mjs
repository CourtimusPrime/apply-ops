#!/usr/bin/env node
/**
 * verify-pipeline.mjs — Health check for masters-ops pipeline integrity
 *
 * Checks:
 * 1. All statuses are canonical (per states.yml)
 * 2. No duplicate university+program entries
 * 3. All report links point to existing files
 * 4. Scores match format X.XX/5 or N/A or DUP
 * 5. All rows have proper pipe-delimited format (10 columns)
 * 6. No pending TSVs in tracker-additions/ (only in merged/ or archived/)
 * 7. No bold in scores
 * 8. Deadline format (YYYY-MM-DD, '—', 'rolling', or blank)
 *
 * Handles both old (9-col) and new (10-col, with Deadline) row formats.
 *
 * Run: node verify-pipeline.mjs
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const CAREER_OPS = dirname(fileURLToPath(import.meta.url));
// Support both layouts: data/applications.md (boilerplate) and applications.md (original)
const APPS_FILE = existsSync(join(CAREER_OPS, 'data/applications.md'))
  ? join(CAREER_OPS, 'data/applications.md')
  : join(CAREER_OPS, 'applications.md');
const ADDITIONS_DIR = join(CAREER_OPS, 'batch/tracker-additions');
const REPORTS_DIR = join(CAREER_OPS, 'reports');
const STATES_FILE = existsSync(join(CAREER_OPS, 'templates/states.yml'))
  ? join(CAREER_OPS, 'templates/states.yml')
  : join(CAREER_OPS, 'states.yml');

// Canonical graduate application lifecycle states (lowercase for comparison)
const CANONICAL_STATUSES = [
  'evaluated', 'in progress', 'submitted', 'under review', 'interview',
  'admitted', 'waitlisted', 'rejected', 'committed', 'declined', 'skip',
];

// Aliases that normalize-statuses.mjs will fix automatically
const ALIASES = {
  'in-progress': 'in progress', 'in_progress': 'in progress',
  'wip': 'in progress', 'drafting': 'in progress', 'started': 'in progress',
  'applied': 'submitted', 'sent': 'submitted', 'enviado': 'submitted', 'enviada': 'submitted',
  'under_review': 'under review', 'reviewing': 'under review', 'review': 'under review',
  'interview scheduled': 'interview', 'invited': 'interview', 'entrevista': 'interview',
  'accepted': 'admitted', 'offer': 'admitted', 'acceptance': 'admitted', 'oferta': 'admitted',
  'waitlist': 'waitlisted', 'wait list': 'waitlisted', 'wait-listed': 'waitlisted',
  'declined by program': 'rejected', 'denied': 'rejected', 'rechazado': 'rejected', 'rechazada': 'rejected',
  'enrolled': 'committed', 'accepted offer': 'committed', 'matriculated': 'committed',
  'withdrew': 'declined', 'discarded': 'declined', 'descartado': 'declined',
  'cerrada': 'declined', 'cancelada': 'declined',
  'no aplicar': 'skip', 'no_aplicar': 'skip', 'pass': 'skip', 'not applying': 'skip',
  // Legacy Spanish states
  'evaluada': 'evaluated', 'evaluado': 'evaluated',
  'aplicado': 'submitted', 'aplicada': 'submitted',
  'respondido': 'under review',
};

let errors = 0;
let warnings = 0;

function error(msg) { console.log(`❌ ${msg}`); errors++; }
function warn(msg) { console.log(`⚠️  ${msg}`); warnings++; }
function ok(msg) { console.log(`✅ ${msg}`); }

// --- Read applications.md ---
if (!existsSync(APPS_FILE)) {
  console.log('\n📊 No applications.md found. This is normal for a fresh setup.');
  console.log('   The file will be created when you evaluate your first program.\n');
  process.exit(0);
}
const content = readFileSync(APPS_FILE, 'utf-8');
const lines = content.split('\n');

/**
 * Parse an applications.md row — handles both old (9-col) and new (10-col) formats.
 * Old (9-col):  parts.length == 11  →  date[2], company[3], role[4], score[5], status[6], pdf[7], report[8], notes[9]
 * New (10-col): parts.length == 12  →  date[2], deadline[3], university[4], program[5], score[6], status[7], pdf[8], report[9], notes[10]
 */
function parseRow(parts) {
  if (parts.length >= 12) {
    return {
      date: parts[2], deadline: parts[3], company: parts[4], role: parts[5],
      score: parts[6], status: parts[7], pdf: parts[8], report: parts[9],
      notes: parts[10] || '',
      isNewFormat: true,
    };
  } else {
    return {
      date: parts[2], deadline: null, company: parts[3], role: parts[4],
      score: parts[5], status: parts[6], pdf: parts[7], report: parts[8],
      notes: parts[9] || '',
      isNewFormat: false,
    };
  }
}

const entries = [];
for (const line of lines) {
  if (!line.startsWith('|')) continue;
  const parts = line.split('|').map(s => s.trim());
  if (parts.length < 10) continue;
  const num = parseInt(parts[1]);
  if (isNaN(num)) continue;
  const row = parseRow(parts);
  entries.push({ num, ...row });
}

console.log(`\n📊 Checking ${entries.length} entries in applications.md\n`);

// --- Check 1: Canonical statuses ---
let badStatuses = 0;
for (const e of entries) {
  const clean = e.status.replace(/\*\*/g, '').trim().toLowerCase();
  // Strip trailing dates
  const statusOnly = clean.replace(/\s+\d{4}-\d{2}-\d{2}.*$/, '').trim();

  if (!CANONICAL_STATUSES.includes(statusOnly) && !ALIASES[statusOnly]) {
    error(`#${e.num}: Non-canonical status "${e.status}"`);
    badStatuses++;
  }

  // Check for markdown bold in status
  if (e.status.includes('**')) {
    error(`#${e.num}: Status contains markdown bold: "${e.status}"`);
    badStatuses++;
  }

  // Check for dates in status
  if (/\d{4}-\d{2}-\d{2}/.test(e.status)) {
    error(`#${e.num}: Status contains date: "${e.status}" — dates go in date column`);
    badStatuses++;
  }
}
if (badStatuses === 0) ok('All statuses are canonical');

// --- Check 2: Duplicates ---
const companyRoleMap = new Map();
let dupes = 0;
for (const e of entries) {
  const key = e.company.toLowerCase().replace(/[^a-z0-9]/g, '') + '::' +
    e.role.toLowerCase().replace(/[^a-z0-9 ]/g, '');
  if (!companyRoleMap.has(key)) companyRoleMap.set(key, []);
  companyRoleMap.get(key).push(e);
}
for (const [key, group] of companyRoleMap) {
  if (group.length > 1) {
    warn(`Possible duplicates: ${group.map(e => `#${e.num}`).join(', ')} (${group[0].company} — ${group[0].role})`);
    dupes++;
  }
}
if (dupes === 0) ok('No exact duplicates found');

// --- Check 3: Report links ---
let brokenReports = 0;
for (const e of entries) {
  const match = e.report.match(/\]\(([^)]+)\)/);
  if (!match) continue;
  const reportPath = join(CAREER_OPS, match[1]);
  if (!existsSync(reportPath)) {
    error(`#${e.num}: Report not found: ${match[1]}`);
    brokenReports++;
  }
}
if (brokenReports === 0) ok('All report links valid');

// --- Check 4: Score format ---
let badScores = 0;
for (const e of entries) {
  const s = e.score.replace(/\*\*/g, '').trim();
  if (!/^\d+\.?\d*\/5$/.test(s) && s !== 'N/A' && s !== 'DUP') {
    error(`#${e.num}: Invalid score format: "${e.score}"`);
    badScores++;
  }
}
if (badScores === 0) ok('All scores valid');

// --- Check 5: Row format (expect new 10-col format) ---
let badRows = 0;
let oldFormatRows = 0;
for (const line of lines) {
  if (!line.startsWith('|')) continue;
  if (line.includes('---') || line.includes('University') || line.includes('Empresa')) continue;
  const parts = line.split('|');
  if (parts.length < 10) {
    error(`Row with <10 pipe segments: ${line.substring(0, 80)}...`);
    badRows++;
  } else if (parts.length < 12) {
    // Old 9-col format — not an error, just a warning
    const num = parseInt(parts[1].trim());
    if (!isNaN(num) && num > 0) {
      oldFormatRows++;
    }
  }
}
if (oldFormatRows > 0) {
  warn(`${oldFormatRows} rows in old 9-col format (missing Deadline column) — run normalize-statuses.mjs or merge-tracker.mjs to upgrade`);
}
if (badRows === 0) ok('All rows properly formatted');

// --- Check 6: Pending TSVs ---
let pendingTsvs = 0;
if (existsSync(ADDITIONS_DIR)) {
  const files = readdirSync(ADDITIONS_DIR).filter(f => f.endsWith('.tsv'));
  pendingTsvs = files.length;
  if (pendingTsvs > 0) {
    warn(`${pendingTsvs} pending TSVs in tracker-additions/ (not merged)`);
  }
}
if (pendingTsvs === 0) ok('No pending TSVs');

// --- Check 7: Bold in scores ---
let boldScores = 0;
for (const e of entries) {
  if (e.score.includes('**')) {
    warn(`#${e.num}: Score has markdown bold: "${e.score}"`);
    boldScores++;
  }
}
if (boldScores === 0) ok('No bold in scores');

// --- Check 8: Deadline format (new format rows only) ---
let badDeadlines = 0;
for (const e of entries) {
  if (!e.isNewFormat || e.deadline === null) continue;
  const dl = e.deadline.trim();
  if (dl === '' || dl === '—' || dl === 'rolling') continue;
  // Must be ISO date YYYY-MM-DD
  if (/\d/.test(dl) && !/^\d{4}-\d{2}-\d{2}$/.test(dl)) {
    warn(`#${e.num}: Deadline "${dl}" looks like a date but is not ISO format (YYYY-MM-DD)`);
    badDeadlines++;
  }
}
if (badDeadlines === 0) ok('All deadlines properly formatted');

// --- Summary ---
console.log('\n' + '='.repeat(50));
console.log(`📊 Pipeline Health: ${errors} errors, ${warnings} warnings`);
if (errors === 0 && warnings === 0) {
  console.log('🟢 Pipeline is clean!');
} else if (errors === 0) {
  console.log('🟡 Pipeline OK with warnings');
} else {
  console.log('🔴 Pipeline has errors — fix before proceeding');
}

process.exit(errors > 0 ? 1 : 0);
