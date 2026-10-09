// ui.mjs — the rich terminal, and the event bus the dashboard's SSE stream taps into. Plain-English
// labels from the start (the lesson learned relabeling attacker-pro after the fact, this time baked
// in from day one): every line says what it means, not just a code.

const QUIET = process.env.RC_QUIET === '1';
const NO_COLOR = process.env.NO_COLOR === '1' || (!process.stdout.isTTY && !process.env.RC_FORCE_COLOR);

const wrap = (code) => (s) => (NO_COLOR ? String(s) : `\x1b[${code}m${s}\x1b[0m`);
export const c = { g: wrap(32), r: wrap(31), y: wrap(33), b: wrap(36), mag: wrap(35), gray: wrap(90), dim: wrap(2), bold: wrap(1), inv: wrap(7) };

const listeners = new Set();
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }

const stamp = () => c.gray(new Date().toISOString().slice(11, 19));
const clip = (s, n = 110) => { s = String(s ?? '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; };

export function emit(evt) {
  evt = { t: Date.now(), ...evt };
  for (const fn of listeners) { try { fn(evt); } catch { /* a dead listener must never break a run */ } }
  if (QUIET) return evt;
  render(evt);
  return evt;
}

export function banner(title, sub) {
  if (QUIET) return;
  const w = 78, bar = '─'.repeat(w);
  console.log('\n' + c.b('┌' + bar + '┐'));
  console.log(c.b('│ ') + c.bold(title.padEnd(w - 2)) + c.b(' │'));
  if (sub) console.log(c.b('│ ') + c.dim(clip(sub, w - 2).padEnd(w - 2)) + c.b(' │'));
  console.log(c.b('└' + bar + '┘'));
}
export const rule = () => { if (!QUIET) console.log(c.gray('  ' + '─'.repeat(76))); };

const SEV_COLOR = { Critical: c.r, High: c.r, Medium: c.y, Low: c.dim };

function render(e) {
  switch (e.type) {
    case 'phase': console.log('\n  ' + c.inv(c.bold(` ${e.name} `)) + (e.note ? '  ' + c.dim(e.note) : '')); break;
    case 'strategy': {
      rule();
      const sev = SEV_COLOR[e.severity] || c.dim;
      console.log(`  ${c.bold(e.title)}`);
      console.log(`  ${c.dim('goal =')} ${c.b(e.objectiveLabel)}  ${c.dim('severity =')} ${sev(e.severity)}`);
      break;
    }
    case 'say': console.log(`    ${c.gray('→ attacker  ')} ${clip(e.text, 100)}`); break;
    case 'reply': console.log(`    ${c.gray('← chatbot   ')} ${clip(e.text, 100)}`); break;
    case 'verdict': e.hit
      ? console.log(`  ${c.g('✓ FOUND IT')}  ${c.bold(e.label)}  ${c.dim('(' + e.kind + ': ' + clip(e.evidence, 70) + ')')}`)
      : console.log(`  ${c.y('✗ held')} ${c.dim(e.detail || '')}`); break;
    case 'verify': console.log(`  ${c.dim(e.id.padEnd(26))} confidence ${e.ok ? c.g(e.repro) : c.r(e.repro)}`); break;
    case 'info': console.log(`  ${c.dim(e.msg)}`); break;
    case 'warn': console.log(`  ${c.y('⚠ ' + e.msg)}`); break;
    case 'error': console.log(`  ${c.r('✖ ' + e.msg)}`); break;
    default: console.log(`  ${c.dim(JSON.stringify(e))}`);
  }
}

export function findingsTable(findings) {
  if (QUIET) return;
  console.log('\n  ' + c.bold('findings'));
  console.log('  ' + c.dim('id'.padEnd(28) + 'goal'.padEnd(34) + 'status'.padEnd(12) + 'severity'));
  for (const f of findings) {
    const badge = f.status === 'CONFIRMED' ? c.g('CONFIRMED  ') : f.status === 'REJECTED' ? c.r('REJECTED   ') : c.y('CANDIDATE  ');
    const sev = SEV_COLOR[f.severity] || c.dim;
    console.log('  ' + f.id.padEnd(28) + clip(f.objectiveLabel, 32).padEnd(34) + badge + sev(f.severity));
  }
}
