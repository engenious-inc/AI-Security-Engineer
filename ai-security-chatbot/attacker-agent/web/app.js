// app.js — ChatRaider dashboard client. Connects to the SSE step stream, drives run/verify, renders
// findings. Vanilla JS, no build step.
const $ = (s) => document.querySelector(s);
const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
const clip = (s, n) => { s = String(s ?? '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
const ts = (t) => new Date(t || Date.now()).toISOString().slice(11, 19);

document.querySelectorAll('.tabs .tab').forEach((t) => t.onclick = () => {
  document.querySelectorAll('.tabs .tab').forEach((x) => x.classList.remove('active'));
  document.querySelectorAll('.pane').forEach((x) => x.classList.remove('active'));
  t.classList.add('active'); $('#pane-' + t.dataset.pane).classList.add('active');
  if (t.dataset.pane === 'findings') loadFindings();
  if (t.dataset.pane === 'glossary') loadGlossary();
});

// ---------- SSE stream ----------
const stream = $('#stream');
function addEvent(e) {
  if (e.type === 'runStart') { stream.innerHTML = ''; setRunning(true); return; }
  if (e.type === 'runEnd') { setRunning(false); loadFindings(); return; }
  const line = fmt(e);
  if (!line) return;
  const div = el('div', 'ev ' + line.cls, (e._replay ? '' : `<span class="ts">${ts(e.t)}</span>`) + line.html);
  stream.appendChild(div);
  stream.parentElement.scrollTop = stream.parentElement.scrollHeight;
}
const SEV_CLASS = { Critical: 'crit', High: 'high', Medium: 'med', Low: 'low' };
function fmt(e) {
  switch (e.type) {
    case 'phase': return { cls: 'phase', html: esc(e.name) + (e.note ? ' · ' + esc(e.note) : '') };
    case 'strategy': return { cls: 'strategy', html: `<b>${esc(e.title)}</b><br>&nbsp;&nbsp;goal = ${esc(e.objectiveLabel)} &middot; severity = <span class="sevtag ${SEV_CLASS[e.severity] || ''}">${esc(e.severity)}</span>` };
    case 'say': return { cls: 'say', html: '→ attacker&nbsp; ' + esc(clip(e.text, 140)) };
    case 'reply': return { cls: 'reply', html: '← chatbot&nbsp; ' + esc(clip(e.text, 140)) };
    case 'verdict': return e.hit
      ? { cls: 'verdict hit', html: `✓ FOUND IT &nbsp;<b>${esc(e.label)}</b> <span class="mut">(${esc(e.kind)}: ${esc(clip(e.evidence, 80))})</span>` }
      : { cls: 'verdict miss', html: '✗ ' + esc(e.detail || 'held') };
    case 'verify': return { cls: 'verdict ' + (e.ok ? 'hit' : 'miss'), html: `${esc(e.id)} &nbsp;confidence ${esc(e.repro)}` };
    case 'info': return { cls: 'info', html: esc(clip(e.msg, 180)) };
    case 'warn': return { cls: 'warn', html: '⚠ ' + esc(e.msg) };
    case 'error': return { cls: 'error', html: '✖ ' + esc(e.msg) };
    default: return null;
  }
}
function connect() {
  const es = new EventSource('/api/stream');
  es.onopen = () => setBadge();
  es.onmessage = (m) => { try { addEvent(JSON.parse(m.data)); } catch {} };
  es.onerror = () => { $('#statusBadge').textContent = 'reconnecting…'; $('#statusBadge').className = 'badge idle'; };
}

// ---------- state / controls ----------
let running = false;
function setRunning(v) { running = v; $('#runBtn').disabled = v; $('#verifyBtn').disabled = v; setBadge(); }
function setBadge() { const b = $('#statusBadge'); b.textContent = running ? '● running' : '○ idle'; b.className = 'badge ' + (running ? 'live' : 'idle'); }

async function loadState() {
  const s = await fetch('/api/state').then((r) => r.json());
  $('#metaTarget').textContent = 'target: ' + s.target;
  $('#metaBrain').textContent = 'brain: ' + (s.brain || 'none (scripted)');
  $('#cfgTarget').textContent = s.target;
  $('#cfgVictim').textContent = s.victim;
  $('#cfgBrain').textContent = s.brain || 'none — fully scripted';
  $('#objList').innerHTML = s.objectives.map((o) => `<div class="objrow"><span class="sevtag ${SEV_CLASS[o.severity] || ''}">${esc(o.severity)}</span> ${esc(o.label)}</div>`).join('');
  glossaryCache = s.glossary || [];
  running = s.running; setRunning(s.running);
  updateCounts(s.counts);
}
function updateCounts(c) { if (!c) return; $('#fCount').textContent = c.total ? `${c.confirmed}✓ / ${c.total}` : ''; }

$('#runBtn').onclick = async () => { const r = await fetch('/api/run', { method: 'POST' }).then((r) => r.json()); if (r.error) alert(r.error); else setRunning(true); };
$('#verifyBtn').onclick = async () => { const r = await fetch('/api/verify', { method: 'POST' }).then((r) => r.json()); if (r.error) alert(r.error); else setRunning(true); };

// ---------- findings ----------
async function loadFindings() {
  const { findings } = await fetch('/api/findings').then((r) => r.json());
  const c = $('#cards');
  updateCounts({ total: findings.length, confirmed: findings.filter((f) => f.status === 'CONFIRMED').length });
  if (!findings.length) { c.innerHTML = '<div class="empty">No findings yet — run a campaign.</div>'; return; }
  const order = { CONFIRMED: 0, CANDIDATE: 1, REJECTED: 2 };
  findings.sort((a, b) => order[a.status] - order[b.status]);
  c.innerHTML = '';
  for (const f of findings) {
    const card = el('div', 'card');
    card.innerHTML =
      `<span class="sev ${SEV_CLASS[f.severity] || ''}">${esc(f.severity)}</span>` +
      `<h4>${esc(f.title || f.id)}</h4><div class="id">${esc(f.id)} · ${esc(f.objectiveLabel)}</div>` +
      `<div><span class="pill ${f.status}">${esc(f.status)}</span>` +
      (f.verification ? `<span class="pill">confidence ${esc(f.verification.reproduced)}</span>` : '') +
      `<span class="pill">${esc(f.owasp || '')}</span></div>` +
      `<div style="margin-top:6px;color:var(--dim);font-size:12px">${esc(clip(f.evidence, 140))}</div>` +
      `<details><summary>transcript (${(f.transcript || []).length} turn(s))</summary><pre>${esc((f.transcript || []).map((t, i) => `${i + 1}. you: ${t.user}\n   bot: ${clip(t.reply, 200)}`).join('\n'))}</pre></details>`;
    c.appendChild(card);
  }
}

// ---------- glossary ----------
let glossaryCache = [];
function loadGlossary() {
  const box = $('#glossaryList');
  if (!glossaryCache.length) { box.innerHTML = '<div class="empty">No glossary loaded.</div>'; return; }
  box.innerHTML = glossaryCache.map((g) => `<dt>${esc(g.term)}</dt><dd>${esc(g.desc)}</dd>`).join('');
}

connect(); loadState();
