// target.mjs — the adapter that talks to the MerciBank agent (the thing under test).
// This is the ONLY place that knows MerciBank's HTTP envelope. Everything else calls send().
//
// It mirrors what you built in Week 2: POST /v1/chat/completions, a bearer token, a JSON body,
// and a non-OpenAI reply at reply.text. Multi-turn works by passing the SAME session_id back.
//
// Rules of engagement: MERCI_TARGET_URL must point at YOUR OWN local MerciBank (localhost:8080).
// Nothing else. See rules-of-engagement.md.

const TARGET_URL = (process.env.MERCI_TARGET_URL || 'http://localhost:8080/v1/chat/completions');
const TARGET_KEY = (process.env.MERCI_TARGET_KEY || 'merci-lab-key');

if (!/^https?:\/\/(localhost|127\.0\.0\.1)(:|\/)/.test(TARGET_URL)) {
  console.error(`\n  REFUSING: MERCI_TARGET_URL is "${TARGET_URL}".`);
  console.error('  This lab attacks your OWN local MerciBank only (localhost). See rules-of-engagement.md.\n');
  process.exit(1);
}

// One HTTP call to the target. Retries politely on the target's 429 rate limit (Retry-After).
async function post(messages, sessionId) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const r = await fetch(TARGET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TARGET_KEY}` },
      body: JSON.stringify({ model: 'merci-assistant', messages, session_id: sessionId }),
    });
    if (r.status === 429) {
      const wait = Number(r.headers.get('retry-after') || 2);
      await sleep((wait + 0.2) * 1000);
      continue;
    }
    const text = await r.text();
    let json;
    try { json = JSON.parse(text); } catch { throw new Error(`target returned non-JSON (${r.status}): ${text.slice(0, 200)}`); }
    if (!r.ok) throw new Error(`target ${r.status}: ${json?.error?.message || text.slice(0, 200)}`);
    return json;
  }
  throw new Error('target stayed rate-limited after several retries — slow down (raise ATTACK_DELAY_MS)');
}

// A conversation you can carry across turns. Each Conversation keeps one session_id, so the target
// remembers earlier turns — that is what makes multi-turn (crescendo-style) attacks possible.
export class Conversation {
  constructor() { this.sessionId = undefined; this.turns = []; }
  async say(userText) {
    // MerciBank derives context from its own server-side session history, so we only send the new turn.
    const json = await post([{ role: 'user', content: userText }], this.sessionId);
    this.sessionId = json.session_id || this.sessionId;
    const reply = json?.reply?.text ?? '';
    const turn = {
      user: userText,
      reply,
      toolCalls: json.tool_calls || [],
      retrieved: json.retrieved || [],
      findingsHint: json.findings_hint || {},
      traceId: json.trace_id,
      sessionId: this.sessionId,
    };
    this.turns.push(turn);
    return turn;
  }
}

// A one-shot health check so a run fails fast with a clear message instead of a wall of errors.
export async function health() {
  const base = TARGET_URL.replace(/\/v1\/.*$/, '');
  const r = await fetch(`${base}/health`);
  if (!r.ok) throw new Error(`health ${r.status}`);
  return r.json(); // { ok, model, hasKey }
}

export const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
export const targetInfo = { url: TARGET_URL };
