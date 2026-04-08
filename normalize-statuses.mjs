#!/usr/bin/env node
/**
 * normalize-statuses.mjs — Clean non-canonical states in applications.md
 *
 * Maps all non-canonical statuses to canonical ones per states.yml:
 *   Evaluated, In Progress, Submitted, Under Review, Interview,
 *   Admitted, Waitlisted, Rejected, Committed, Declined, SKIP
 *
 * Also maps legacy Spanish job-search states to new English graduate states:
 *   Evaluada → Evaluated, Aplicado → Submitted, Respondido → Under Review,
 *   Oferta → Admitted, Rechazado → Rejected, Descartado → Declined, NO APLICAR → SKIP
 *
 * Also strips markdown bold (**) and dates from the status field.
 *
 * Handles both old (9-col, no Deadline) and new (10-col, with Deadline) row formats.
 *
 * Run: node normalize-statuses.mjs [--dry-run]
 */

import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const CAREER_OPS = dirname(fileURLToPath(import.meta.url));
// Support both layouts: data/applications.md (boilerplate) and applications.md (original)
const APPS_FILE = existsSync(join(CAREER_OPS, 'data/applications.md'))
  ? join(CAREER_OPS, 'data/applications.md')
  : join(CAREER_OPS, 'applications.md');
const DRY_RUN = process.argv.includes('--dry-run');

// Canonical graduate application lifecycle states
const CANONICAL_STATES = [
  'Evaluated', 'In Progress', 'Submitted', 'Under Review', 'Interview',
  'Admitted', 'Waitlisted', 'Rejected', 'Committed', 'Declined', 'SKIP',
];

// Canonical status mapping
function normalizeStatus(raw) {
  // Strip markdown bold
  let s = raw.replace(/\*\*/g, '').trim();
  const lower = s.toLowerCase();

  // Strip trailing dates (e.g. "Aplicado 2024-01-15")
  const statusOnly = lower.replace(/\s+\d{4}-\d{2}-\d{2}.*$/, '').trim();

  // Already canonical — just fix casing/bold
  for (const c of CANONICAL_STATES) {
    if (statusOnly === c.toLowerCase()) return { status: c };
  }

  // Legacy Spanish job-search states → new English graduate states
  if (['evaluada', 'evaluado', 'evaluated', 'condicional', 'hold', 'evaluar', 'verificar', 'monitor'].includes(statusOnly)) {
    return { status: 'Evaluated' };
  }
  if (['aplicado', 'aplicada', 'applied', 'enviada', 'enviado', 'sent'].includes(statusOnly)) {
    return { status: 'Submitted' };
  }
  if (['respondido'].includes(statusOnly)) {
    return { status: 'Under Review' };
  }
  if (['entrevista'].includes(statusOnly)) {
    return { status: 'Interview' };
  }
  if (['oferta'].includes(statusOnly)) {
    return { status: 'Admitted' };
  }
  if (['rechazado', 'rechazada'].includes(statusOnly)) {
    return { status: 'Rejected' };
  }
  if (['descartado', 'descartada', 'descartada', 'cerrada', 'cancelada', 'discarded'].includes(statusOnly)) {
    return { status: 'Declined' };
  }
  if (['no aplicar', 'no_aplicar', 'skip', 'pass', 'not applying'].includes(statusOnly)) {
    return { status: 'SKIP' };
  }

  // DUPLICADO/Repost variants → Declined
  if (/^duplicado/i.test(s) || /^dup\b/i.test(s)) {
    return { status: 'Declined', moveToNotes: raw.trim() };
  }
  if (/^repost/i.test(s)) {
    return { status: 'Declined', moveToNotes: raw.trim() };
  }

  // GEO BLOCKER → SKIP
  if (/geo.?blocker/i.test(s)) return { status: 'SKIP' };

  // "—" or blank → Declined
  if (s === '—' || s === '-' || s === '') return { status: 'Declined' };

  // Unknown — flag it
  return { status: null, unknown: true };
}

// Detect row format by column count
// Old (9-col): '' | # | date | company | role | score | status | pdf | report | notes | ''  → length 11
// New (10-col): '' | # | date | deadline | university | program | score | status | pdf | report | notes | ''  → length 12
function getColumnIndices(parts) {
  if (parts.length >= 12) {
    // New 10-col format
    return { statusIdx: 7, scoreIdx: 6, notesIdx: 10 };
  } else {
    // Old 9-col format
    return { statusIdx: 6, scoreIdx: 5, notesIdx: 9 };
  }
}

// Read applications.md
if (!existsSync(APPS_FILE)) {
  console.log('No applications.md found. Nothing to normalize.');
  process.exit(0);
}
const content = readFileSync(APPS_FILE, 'utf-8');
const lines = content.split('\n');

let changes = 0;
let unknowns = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (!line.startsWith('|')) continue;

  const parts = line.split('|').map(s => s.trim());
  if (parts.length < 10) continue;
  if (parts[1] === '#' || parts[1] === '---' || parts[1] === '') continue;

  const num = parseInt(parts[1]);
  if (isNaN(num)) continue;

  const { statusIdx, scoreIdx, notesIdx } = getColumnIndices(parts);

  const rawStatus = parts[statusIdx];
  const result = normalizeStatus(rawStatus);

  if (result.unknown) {
    unknowns.push({ num, rawStatus, line: i + 1 });
    continue;
  }

  if (result.status === rawStatus) continue; // Already canonical

  // Apply change
  const oldStatus = rawStatus;
  parts[statusIdx] = result.status;

  // Move DUPLICADO/Repost info to notes if needed
  if (result.moveToNotes && parts[notesIdx] !== undefined) {
    const existing = parts[notesIdx] || '';
    if (!existing.includes(result.moveToNotes)) {
      parts[notesIdx] = result.moveToNotes + (existing ? '. ' + existing : '');
    }
  } else if (result.moveToNotes && parts[notesIdx] === undefined) {
    parts[notesIdx] = result.moveToNotes;
  }

  // Also strip bold from score field
  if (parts[scoreIdx]) {
    parts[scoreIdx] = parts[scoreIdx].replace(/\*\*/g, '');
  }

  // Reconstruct line
  const newLine = '| ' + parts.slice(1, -1).join(' | ') + ' |';
  lines[i] = newLine;
  changes++;

  console.log(`#${num}: "${oldStatus}" → "${result.status}"`);
}

if (unknowns.length > 0) {
  console.log(`\n⚠️  ${unknowns.length} unknown statuses:`);
  for (const u of unknowns) {
    console.log(`  #${u.num} (line ${u.line}): "${u.rawStatus}"`);
  }
}

console.log(`\n📊 ${changes} statuses normalized`);

if (!DRY_RUN && changes > 0) {
  // Backup first
  copyFileSync(APPS_FILE, APPS_FILE + '.bak');
  writeFileSync(APPS_FILE, lines.join('\n'));
  console.log('✅ Written to applications.md (backup: applications.md.bak)');
} else if (DRY_RUN) {
  console.log('(dry-run — no changes written)');
} else {
  console.log('✅ No changes needed');
}
