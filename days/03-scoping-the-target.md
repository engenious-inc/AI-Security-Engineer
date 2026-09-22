# Day 3 (Sat Sep 20, 2026): Scoping the target, AIVSS, intake & recon

First session of Weekend 2, the hands-on turn after Week 1. The pre-attack day: understand the business
and the system, agree the rules, then connect to the target. Led by Vladimir Tanev (AIVSS lecture) and
Jaime Mantilla (tools and the recon lab), hosted by Tagir Fakhriev.

**Lab target:** [`labs/week2-mercibank/`](../labs/week2-mercibank/) (the MerciBank support-agent lab: a
live LLM with function-calling tools, a help-centre RAG store, and session memory, over an HTTP API;
called "Mercy Bank" in the sessions). Read [`rules-of-engagement.md`](../labs/week2-mercibank/rules-of-engagement.md)
first.

## What we covered
- **Homework show-and-tell.** Students shared week work that already reached today's topics: job-post
  analysis for portfolio scope, Claude Code with a guide-don't-solve `claude.md`, an attack-success-rate
  script (promptfoo over-reported success when not all attacks ran), a live-avatar app with a guardrail gap,
  and a Postman + Burp Suite backend walk-through confirming server-side guardrails.
- **AIVSS.** Why CVSS (traditional, ~2005, v4.0) cannot score agents, and how AIVSS (an OWASP project,
  currently v0.8) complements it: adding agentic factors can push a CVSS 4.6 to a high 7.5-7.6. Ten factors,
  each 0.0-1.0, scored as 0 / 0.5 / 1 for now; named factors include autonomy, tool use, memory,
  context/environment, and dynamic identity. AIVSS is continuous, not one-time.
- **Intake questionnaire.** No standard exists; use a decision tree from a small root set of business and
  technical questions, and expect a gap between what the client declares and what you observe. The client is
  Mercy Bank: a retail bank support agent with RAG and tools (balances, cards, transfers, account recovery).
- **Rules of engagement.** The ROE is what makes testing legal: authorization, scope in and out, testing
  window, limits (no DoS, no real data, no pivoting), kill switch, contacts, and evidence handling. The lab
  ROE authorizes only the local Mercy Bank target.
- **Recon and fingerprinting.** Recon is the high-level picture; fingerprinting narrows it (model, version,
  RAG, tools, memory, sessions).

## Tools shown
Claude Code / Codex / Cursor / OpenCode (coding assistants) · ChatGPT · Postman · Burp Suite · Open Router ·
LM Studio · promptfoo (`redteam init` vs `redteam setup`, `output report.json`) · VS Code with a
markdown-preview plugin · git · npm. Referenced: the AIVSS calculator, an AI-vulnerability list (ATLAS),
TryHackMe, and a new non-LLM classifier model (name transcribed as JEF/GEF, company TypeSafe) shared as news.

## Exercises (paired)
1. **Paper recon on the questionnaire** (~30 min): from the Mercy Bank intake alone (no code), give the
   purpose and top forbidden action, map applicable risks against the OWASP LLM Top 10 and Agentic Top 10,
   and write two or three attack hypotheses in the form "because it has X, I would try Y".
2. **Connect to the target** (hands-on): the target is [`labs/week2-mercibank/`](../labs/week2-mercibank/).
   Copy `.env.example` to `.env`, add an OpenAI-compatible model key (OpenRouter, OpenAI, or a local model),
   `npm start` (the target has zero dependencies), then check `curl localhost:8080/health`. There is no UI,
   so talk to `POST /v1/chat/completions` with `Authorization: Bearer merci-lab-key` via curl or Postman.
   Step by step: [`labs/week2-mercibank/day3-recon-and-connect.md`](../labs/week2-mercibank/day3-recon-and-connect.md).

## Homework
Fill in the declared-vs-observed recon table (entry points and authorization, response shape and evidence,
tools that read vs act, RAG and knowledge base, memory and sessions), mapping declared to the questionnaire
and observed to the running system and codebase; connect Mercy Bank and attack it with promptfoo; and install
Docker, Burp Suite, and Firefox for next weekend.

*Recording + transcript shared with the cohort.*
