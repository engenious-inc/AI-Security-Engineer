# Module 01: Manual red-team

> **Days 3-4** · guides: [`../../days/03-scoping-the-target.md`](../../days/03-scoping-the-target.md),
> [`../../days/04-attacking-the-agent.md`](../../days/04-attacking-the-agent.md) · as-taught:
> [`../../session-notes/2026-09_weekend-2.md`](../../session-notes/2026-09_weekend-2.md)

**Lab target:** [`mercibank/`](mercibank/): MerciBank Assistant, a deliberately-vulnerable bank
support agent (live LLM + function-calling tools + help-centre RAG + session memory) over an HTTP API.

The pre-attack work, then the attack. Day 3 scopes the target: AIVSS (why CVSS cannot score agents),
the intake questionnaire, rules of engagement, and recon/fingerprinting against the running lab. Day 4
attacks MerciBank by hand, tagging each attack against the OWASP LLM and Agentic Top 10s and building
the findings into a promptfoo framework, with a recurring lesson on writing correct assertions.

Run it: `cd mercibank && cp .env.example .env` (add a model key), then `npm start`
(MerciBank on `http://localhost:8080`). See the lab's own README and `rules-of-engagement.md`.
