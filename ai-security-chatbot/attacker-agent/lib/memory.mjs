// memory.mjs — the whole persistence layer, as plain files (same idea as attacker-pro's). No DB.
//
//   campaign/
//     findings/<ID>.json        CANDIDATE → CONFIRMED/REJECTED
//     session-journal.md        human-readable timeline

import { readFileSync, writeFileSync, mkdirSync, existsSync, appendFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
export const DIR = process.env.CAMPAIGN_DIR || join(ROOT, 'campaign');
const FINDINGS = join(DIR, 'findings');

function ensure() { for (const d of [DIR, FINDINGS]) if (!existsSync(d)) mkdirSync(d, { recursive: true }); }

export function journal(line) { ensure(); appendFileSync(join(DIR, 'session-journal.md'), `- ${new Date().toISOString()} — ${line}\n`); }

export function saveFinding(f) { ensure(); writeFileSync(join(FINDINGS, `${f.id}.json`), JSON.stringify(f, null, 2)); }
export function loadFinding(id) { try { return JSON.parse(readFileSync(join(FINDINGS, `${id}.json`), 'utf8')); } catch { return null; } }
export function loadAllFindings() {
  ensure();
  return readdirSync(FINDINGS).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(readFileSync(join(FINDINGS, f), 'utf8')));
}

export const paths = { DIR, FINDINGS };
