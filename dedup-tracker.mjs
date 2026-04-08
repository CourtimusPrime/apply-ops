#!/usr/bin/env node
/**
 * dedup-tracker.mjs — Remove duplicate entries from applications.md
 *
 * Groups by normalized company + fuzzy role match.
 * Keeps entry with highest score. If discarded entry had more advanced status,
 * preserves that status. Merges notes.
 *
 * Handles both old (9-col, no Deadline) and new (10-col, with Deadline) row formats.
 *
 * Run: node dedup-tracker.mjs [--dry-run]
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

// Status advancement order for graduate application lifecycle (higher = more advanced)
// Terminal states (rejected/declined/skip) are treated below active states
const STATUS_RANK = {
  'skip': 0,
  'declined': 0,
  'rejected': 1,      // Terminal — below active states
  'evaluated': 2,
  'in progress': 3,
  'in_progress': 3,
  'submitted': 4,
  'under review': 5,
  'under_review': 5,
  'interview': 6,
  'waitlisted': 7,
  'admitted': 8,
  'committed': 9,
};

function normalizeCompany(name) {
  return name.toLowerCase()
    .replace(/[()]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9 ]/g, '')
    .trim();
}

function normalizeRole(role) {
  return role.toLowerCase()
    .replace(/[()]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9 /]/g, '')
    .trim();
}

function roleMatch(a, b) {
  const wordsA = normalizeRole(a).split(/\s+/).filter(w => w.length > 3);
  const wordsB = normalizeRole(b).split(/\s+/).filter(w => w.length > 3);
  const overlap = wordsA.filter(w => wordsB.some(wb => wb.includes(w) || w.includes(wb)));
  return overlap.length >= 2;
}

function parseScore(s) {
  const m = s.replace(/\*\*/g, '').match(/([\d.]+)/);
  return m ? parseFloat(m[1]) : 0;
}

/**
 * Parse an applications.md row into a structured object.
 * Handles both:
 *   Old (9-col): '' | # | date | company | role | score | status | pdf | report | notes | ''  → parts.length 11
 *   New (10-col): '' | # | date | deadline | university | program | score | status | pdf | report | notes | ''  → parts.length 12
 */
function parseAppLine(line) {
  const parts = line.split('|').map(s => s.trim());
  if (parts.length < 10) return null;
  const num = parseInt(parts[1]);
  if (isNaN(num)) return null;

  if (parts.length >= 12) {
    // New 10-col format (with Deadline column)
    return {
      num,
      date: parts[2],
      deadline: parts[3],
      company: parts[4],
      role: parts[5],
      score: parts[6],
      status: parts[7],
      pdf: parts[8],
      report: parts[9],
      notes: parts[10] || '',
      raw: line,
    };
  } else {
    // Old 9-col format (no Deadline column)
    return {
      num,
      date: parts[2],
      deadline: '—',
      company: parts[3],
      role: parts[4],
      score: parts[5],
      status: parts[6],
      pdf: parts[7],
      report: parts[8],
      notes: parts[9] || '',
      raw: line,
    };
  }
}

// Read
if (!existsSync(APPS_FILE)) {
  console.log('No applications.md found. Nothing to dedup.');
  process.exit(0);
}
const content = readFileSync(APPS_FILE, 'utf-8');
const lines = content.split('\n');

// Parse all entries
const entries = [];
const entryLineMap = new Map(); // num → line index

for (let i = 0; i < lines.length; i++) {
  if (!lines[i].startsWith('|')) continue;
  const app = parseAppLine(lines[i]);
  if (app && app.num > 0) {
    entries.push(app);
    entryLineMap.set(app.num, i);
  }
}

console.log(`📊 ${entries.length} entries loaded`);

// Group by company+role
const groups = new Map();
for (const entry of entries) {
  const key = normalizeCompany(entry.company);
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(entry);
}

// Find duplicates
let removed = 0;
const linesToRemove = new Set();

for (const [company, companyEntries] of groups) {
  if (companyEntries.length < 2) continue;

  // Within same company, find role matches
  const processed = new Set();
  for (let i = 0; i < companyEntries.length; i++) {
    if (processed.has(i)) continue;
    const cluster = [companyEntries[i]];
    processed.add(i);

    for (let j = i + 1; j < companyEntries.length; j++) {
      if (processed.has(j)) continue;
      if (roleMatch(companyEntries[i].role, companyEntries[j].role)) {
        cluster.push(companyEntries[j]);
        processed.add(j);
      }
    }

    if (cluster.length < 2) continue;

    // Keep the one with highest score
    cluster.sort((a, b) => parseScore(b.score) - parseScore(a.score));
    const keeper = cluster[0];

    // Check if any removed entry has more advanced status
    let bestStatusRank = STATUS_RANK[keeper.status.toLowerCase()] ?? 0;
    let bestStatus = keeper.status;
    for (let k = 1; k < cluster.length; k++) {
      const rank = STATUS_RANK[cluster[k].status.toLowerCase()] ?? 0;
      if (rank > bestStatusRank) {
        bestStatusRank = rank;
        bestStatus = cluster[k].status;
      }
    }

    // Update keeper's status if a removed entry had a more advanced one
    if (bestStatus !== keeper.status) {
      const lineIdx = entryLineMap.get(keeper.num);
      if (lineIdx !== undefined) {
        const parts = lines[lineIdx].split('|').map(s => s.trim());
        // Detect format
        if (parts.length >= 12) {
          parts[7] = bestStatus; // New 10-col format: status at index 7
        } else {
          parts[6] = bestStatus; // Old 9-col format: status at index 6
        }
        lines[lineIdx] = '| ' + parts.slice(1, -1).join(' | ') + ' |';
        console.log(`  📝 #${keeper.num}: status promoted to "${bestStatus}" (from #${cluster.find(e => e.status === bestStatus)?.num})`);
      }
    }

    // Remove duplicates
    for (let k = 1; k < cluster.length; k++) {
      const dup = cluster[k];
      const lineIdx = entryLineMap.get(dup.num);
      if (lineIdx !== undefined) {
        linesToRemove.add(lineIdx);
        removed++;
        console.log(`🗑️  Remove #${dup.num} (${dup.company} — ${dup.role}, ${dup.score}) → kept #${keeper.num} (${keeper.score})`);
      }
    }
  }
}

// Remove lines (in reverse order to preserve indices)
const sortedRemoveIndices = [...linesToRemove].sort((a, b) => b - a);
for (const idx of sortedRemoveIndices) {
  lines.splice(idx, 1);
}

console.log(`\n📊 ${removed} duplicates removed`);

if (!DRY_RUN && removed > 0) {
  copyFileSync(APPS_FILE, APPS_FILE + '.bak');
  writeFileSync(APPS_FILE, lines.join('\n'));
  console.log('✅ Written to applications.md (backup: applications.md.bak)');
} else if (DRY_RUN) {
  console.log('(dry-run — no changes written)');
} else {
  console.log('✅ No duplicates found');
}
