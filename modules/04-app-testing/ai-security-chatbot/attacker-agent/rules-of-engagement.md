# Rules of Engagement — ChatRaider

**Authorized lab use only.** ChatRaider is built to attack **your own local copy** of `ai-security-chatbot`, nothing else.

## In scope
- `http://localhost:5000` (or whatever host/port your own `docker compose` instance is bound to) — the default, no extra setup.
- Any other host, **only** with `ROE_AUTHORIZED=1` and that host listed in `TARGET_ALLOWLIST` in your `.env` — and only if you have explicit, written authorization to test it. `lib/client.mjs` refuses to run against a non-localhost target without both.

## What it actually does
- Logs into the **seeded victim account** once (`customer@example.com` by default, or whatever you set `VICTIM_EMAIL`/`VICTIM_PASSWORD` to), to plant one fictional support ticket with a random, unique marker string.
- Every attack after that runs **unauthenticated** — no account, no cookie — against your own running instance's public API.
- Never touches real user data: the ticket it creates and attacks is one it just made up itself, every run.
- Writes findings only to `campaign/` inside this folder (gitignored) — nothing leaves your machine.

## What it's for
Demonstrating, live, that known, already-documented bugs in this teaching app are real and automatable — not a tool for testing anything else. If you find yourself pointing `TARGET_URL` at anything other than your own `localhost` instance, stop and get written authorization first.
