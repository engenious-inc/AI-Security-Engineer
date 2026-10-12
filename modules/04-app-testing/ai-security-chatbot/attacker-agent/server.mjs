// server.mjs — the ChatRaider dashboard: a local control room. Zero npm deps (node:http + SSE +
// vanilla JS). Runs the same engine/verify code in-process and streams every step to the browser,
// so the terminal and the web view show the exact same thing.
//
//   npm run dashboard    →  http://localhost:8788

import './lib/env.mjs';
process.env.RC_QUIET = process.env.RC_QUIET || '1'; // quiet the server's own stdout; events still stream
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { subscribe } from './lib/ui.mjs';
import { runCampaign } from './lib/engine.mjs';
import { runVerify } from './lib/verify.mjs';
import * as brain from './lib/brain.mjs';
import * as mem from './lib/memory.mjs';
import { OBJECTIVES } from './lib/objectives.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB = join(HERE, 'web');
const PORT = Number(process.env.RC_DASHBOARD_PORT || 8788);
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };

const GLOSSARY = [
  { term: 'Objective', desc: 'the specific bug being targeted — what a win would prove.' },
  { term: 'Canary', desc: 'a unique string planted in advance; if it shows up in a reply, that is proof.' },
  { term: 'Flag', desc: 'proof by side-effect — real state (like a ticket status) actually changed.' },
  { term: 'Candidate', desc: 'hit once. Not yet proven reproducible.' },
  { term: 'Confirmed', desc: 'reproduced enough times (the "confidence threshold") to be trusted.' },
  { term: 'Rejected', desc: 'did not reproduce reliably enough — treated as a fluke, not a finding.' },
  { term: 'Attacker brain', desc: 'an optional model that can rephrase a message after a refusal. Everything still runs with zero keys, just less adaptively.' },
];

// ---- SSE event ring + fan-out ----
const RING = [];
const clients = new Set();
subscribe((evt) => {
  RING.push(evt); if (RING.length > 200) RING.shift();
  const line = `data: ${JSON.stringify(evt)}\n\n`;
  for (const res of clients) res.write(line);
});

const run = { running: false, stage: 'idle' };

function sendJson(res, obj, status = 200) { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); }
function countFindings() {
  const all = mem.loadAllFindings();
  return { total: all.length, confirmed: all.filter((f) => f.status === 'CONFIRMED').length };
}

async function startCampaign() {
  if (run.running) return { error: 'already running' };
  run.running = true; run.stage = 'campaign';
  (async () => {
    const push = (e) => { for (const res of clients) res.write(`data: ${JSON.stringify({ ...e, t: Date.now() })}\n\n`); };
    push({ type: 'runStart', mode: 'campaign' });
    try { await runCampaign({}); }
    catch (e) { push({ type: 'error', msg: e.message }); }
    finally { run.running = false; run.stage = 'idle'; push({ type: 'runEnd', mode: 'campaign', at: Date.now() }); }
  })();
  return { ok: true };
}
async function startVerify() {
  if (run.running) return { error: 'already running' };
  run.running = true; run.stage = 'verify';
  (async () => {
    const push = (e) => { for (const res of clients) res.write(`data: ${JSON.stringify({ ...e, t: Date.now() })}\n\n`); };
    push({ type: 'runStart', mode: 'verify' });
    try { await runVerify({}); }
    catch (e) { push({ type: 'error', msg: e.message }); }
    finally { run.running = false; run.stage = 'idle'; push({ type: 'runEnd', mode: 'verify', at: Date.now() }); }
  })();
  return { ok: true };
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const p = url.pathname;
  try {
    if (p === '/api/stream') {
      res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
      res.write('retry: 2000\n\n');
      for (const evt of RING.slice(-200)) res.write(`data: ${JSON.stringify({ ...evt, _replay: true })}\n\n`);
      clients.add(res); req.on('close', () => clients.delete(res));
      return;
    }
    if (p === '/api/state') {
      return sendJson(res, {
        target: process.env.TARGET_URL || 'http://localhost:5000',
        victim: process.env.VICTIM_EMAIL || 'customer@example.com',
        brain: brain.status(),
        running: run.running, stage: run.stage,
        objectives: Object.entries(OBJECTIVES).map(([id, o]) => ({ id, label: o.label, severity: o.severity })),
        counts: countFindings(),
        glossary: GLOSSARY,
      });
    }
    if (p === '/api/findings') return sendJson(res, { findings: mem.loadAllFindings() });

    if (req.method === 'POST') {
      if (p === '/api/run') return sendJson(res, await startCampaign());
      if (p === '/api/verify') return sendJson(res, await startVerify());
    }

    // ---- static ----
    const file = p === '/' ? 'index.html' : p.replace(/^\//, '');
    const data = await readFile(join(WEB, file));
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
    return res.end(data);
  } catch (e) {
    sendJson(res, { error: e.message }, p.startsWith('/api') ? 500 : 404);
  }
});

server.listen(PORT, () => {
  console.log(`\n  ChatRaider dashboard — http://localhost:${PORT}`);
  console.log(`  target: ${process.env.TARGET_URL || 'http://localhost:5000'}  ·  brain: ${brain.status() || 'none (fully scripted)'}\n`);
});
