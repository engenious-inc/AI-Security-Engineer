# ChatRaider — attacker agent for ai-security-chatbot

A small, modern demo tool: point it at your own running `ai-security-chatbot` and watch it find and
prove five real, already-documented vulnerabilities live — a leaner sibling of `labs/attacker-pro`
(which does the same thing for MerciBank), built specifically to motivate students before they try
it themselves.

> ⚠️ **Authorized lab use only.** Ships pointed at your own instance on `localhost`. See
> `rules-of-engagement.md`.

## What it finds

| Objective | What it proves | Severity |
|---|---|---|
| Ticket BOLA | reads another customer's full ticket — subject, status, description — via a plain chat message, no login needed | High |
| Unauthenticated admin mutation | changes any ticket's status with **zero** login and **zero** cookie | Critical |
| RAG secret leak | gets planted internal secrets (API keys, passwords) out of the knowledge base via chat | High |
| Unauthorized ticket closure | closes someone else's ticket just by mentioning its number in a chat message | Critical |
| Guideline/prompt-leak jailbreak | gets the bot to quote its own "do not reveal this" system instructions | Medium |

Each one is proven, not asserted — either a planted **canary** string shows up in a reply, or real
state (a ticket's status) is re-checked afterward through a different, properly-scoped endpoint.

## Quickstart (about a minute)

```bash
cd ai-security-chatbot/attacker-agent
cp .env.example .env            # defaults already match the seeded test accounts — no edits required
npm start                       # attacks http://localhost:5000
```

Requires your `ai-security-chatbot` already running (`docker compose up`, port 5000) with the seed
accounts in place. Runs with **zero API keys** — every attack message is scripted. Add an
`ATTACKER_LLM_*` key in `.env` to let it rephrase a message if the bot refuses a seed.

Then:
```bash
node verify.mjs        # replay each finding a few times, confirm it's reproducible — this is a
                        # real model, so not every attempt lands the same way twice
npm run dashboard       # → http://localhost:8788, the same run as a live web view
```

## Files
```
attack.mjs              run a campaign (the terminal entry point)
verify.mjs              reproduce + confirm findings
server.mjs              the dashboard
lib/client.mjs          the only thing that talks to the target — cookie jar, CSRF scraping, the attack calls
lib/objectives.mjs       what counts as a win, and why (OWASP tag + severity + mechanism, per bug)
lib/strategies.mjs       the curated attack messages
lib/judge.mjs            canary / flag verdicts
lib/brain.mjs            optional LLM-assisted rephrasing — null-safe, zero keys required
lib/engine.mjs           the campaign loop
lib/verify.mjs           the reproduce/confirm pass
lib/memory.mjs           findings persisted as plain JSON under campaign/
lib/ui.mjs               terminal renderer + the event bus the dashboard taps into
web/                     the dashboard's HTML/CSS/JS
rules-of-engagement.md   what this is and isn't authorized to touch
```

## Why it's simpler than attacker-pro
`attacker-pro` explores a big composed matrix of techniques because MerciBank rewards breadth. This
targets five specific, already-known bugs in one real app — so it runs them in a fixed, narratable
order instead of an explore/exploit bandit, uses one static severity per bug instead of full CVSS-style
scoring, and skips the promptfoo regression/red-team integration entirely (that's what `attacker-pro`
is for). Same spirit — deterministic judge, live terminal + dashboard, zero required dependencies,
works with no keys and gets smarter with one — in about a fifth of the code.
