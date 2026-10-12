# Day 7 (Sat Oct 3, 2026): RedCell, the advanced attacker agent and its dashboard

Weekend 4. **Lab:** [`labs/attacker-pro/`](../labs/attacker-pro/) · [`labs/week2-mercibank/`](../labs/week2-mercibank/)

First session of Weekend 4. Low turnout at the start (four to five people, rising to roughly eight or nine
for the breakouts); three attendees were listen-only. Led by Vladimir Tanev (built and presented RedCell),
hosted by Jaime Mantilla (running the Zoom rooms for the first time), with Igor Dorovskikh opening. Week
3's simple attacker agent is replaced by **RedCell**, still pointed at Mercy Bank, with the goal that each
student ends up owning a customized attacker of their own for their portfolio.

## What we covered
- **Opening.** Jaime reported from a tech conference he had attended with his employer as a sponsor: AI
  and AI security were everywhere, but QA/quality vendors were nearly absent, which he framed as an
  opportunity; nobody he spoke to had attacker agents in production yet, though some liked the idea; a
  DevOps-security vendor called CI/CD pipelines (access to code, API keys, tokens) "the biggest door" for
  attackers. Igor added that the AI-security vendors he meets focus on incident response after the fact,
  while this cohort works on prevention.
- **Show-and-tell.** Several students had already extended the Week 3 attacker on their own ahead of
  class: per-target YAML configuration (limits moved out of `.env`), deterministic "oracles" plus scripted
  "behaviors" (openings, follow-ups, hints), a verify step that re-runs claimed hits, a detailed console
  log, an HTML summary, and a "profile + adapter" design meant to let the same engine target other apps.
  One student finally leaked Mercy Bank's system prompt (one of two categories the class had not broken),
  running a local model as the attacker, by building trust first, escalating gradually, and never
  revealing intent up front across a multi-turn conversation.
- **Meet RedCell.** A ten-stage loop: wake, orient, plan, attack, judge, reinforce (the campaign loop),
  then verify, score, promote, report (closing the loop). Every stage has a deterministic code path and an
  optional LLM "brain" per role (recon, strategist, attacker, judge, report). It runs offline against a
  mock adapter with no key, or against the real Mercy Bank. Controlled from an HTML dashboard
  (`npm run dashboard`): target and attacker-brain selection (OpenAI-compatible via OpenRouter), campaign
  settings (strategies, episode count, reproduction bar), a live-run terminal view, findings sorted by
  severity and by confirmed/rejected status, separate developer and executive reports, and promptfoo
  embedded so confirmed findings promote to regression tests without leaving the dashboard. The dashboard
  was left deliberately rough visually so students would rebuild it rather than adopt it as-is; both
  instructors repeated that it is a starting framework to customize, not a tool to adopt as is. A
  human-in-the-loop approval stage was suggested as an option for companies that require one.
- **Decoding the live-run output.** Converters (transforming a message before sending, e.g. encoding it,
  to slip past guardrails) are not yet tagged on finding cards, confirmed as a gap. The dashboard's
  family-priority "bars" are the bandit planner's score for which attack family to try next (untried
  families get top priority; families that keep hitting stay high; families that keep missing drop), and
  were conceded to have at least one display bug. The vocabulary that eventually landed for the group:
  each episode has one **objective** (what you are trying to get), one **family** (the category of attack,
  e.g. access control, sensitive data, chain, encoding), and one **strategy** (a specific attack within a
  family); the planner ranks families by past success.

## Tools shown
RedCell dashboard and CLI (Node, zero dependencies), Mercy Bank, promptfoo, OpenRouter, GPT-4o Mini,
Mistral 7B via Ollama, Claude Code / Codex (CLI use), Claude in Chrome (browser automation driving the
coding assistant), ChatGPT, GitHub, an online Base64 encode/decode tool, TryHackMe.

## Exercises (paired)
1. **Meet RedCell** (groups of four, planned ~30 min, ran closer to 45): clone or pull the repo, run
   Mercy Bank in one terminal and the dashboard in another, then Round A against the mock adapter and
   Round B against the real target.

## Homework
Use an AI coding assistant to rewrite the live-run terminal output so it makes sense to you (explain
objective, family, strategy; replace or annotate the bars with numbers); read the student guide, the
repo's architecture file (`PLAN.md`) and its strategy matrix; start thinking about how to adapt the agent
to next weekend's target as portfolio material.

*Recording + transcript shared with the cohort.*
