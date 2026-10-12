# Day 5 (Sat Sep 26, 2026): Building an attacker AI agent

Weekend 3. **Lab:** [`labs/week3-attacker-agent/`](../labs/week3-attacker-agent/) · [`labs/week2-mercibank/`](../labs/week2-mercibank/)

> **Draft reconstructed from the session transcript**, not yet reviewed by the instructors. Vladimir Tanev
> and Jaime Mantilla should correct and extend this before it is treated as final. Same layout as Days 1-4.

First session of Weekend 3, the automation turn: Week 2 attacked Mercy Bank by hand, this weekend builds
an AI agent that attacks it and verifies the findings. Led by Vladimir Tanev, hosted by Igor Dorovskikh
(breakouts, timekeeping, careers); Jaime Mantilla was out this week, Vladimir covered his part.

## What we covered
- **Homework finding.** On Mercy Bank, entering no OTP correctly blocks a transfer, but entering *any*
  value as the OTP lets the transfer go through even though the chatbot's reply says it is not allowed.
  Confirmed via the tool call itself (it fired regardless of the chat text), reproduced three times, and
  held across different OTP shapes.
- **Why attack from an older or local model.** The newest frontier assistant models refuse
  security/jailbreak-style requests much more aggressively than slightly older ones, so this kind of
  coursework often means falling back a model generation or using an open-source model. A real
  reproducibility risk: attacking through a commercial model's API can get an account flagged or banned
  (both instructors were banned by OpenAI while building this exact system, then reinstated after
  explaining it was authorized security testing).
- **Careers.** Do not be scared off by job-posting titles or years-of-experience lines in a field this
  young; read the actual description and map your labs to it; look for what is common across a set of
  postings; network with practitioners; post 2-3x/week; read papers that show where the field is going.
- **The attacker-agent architecture.** A six-stage episode loop: **Wake -> Orient -> Plan -> Attack ->
  Judge -> Reinforce**. Wake/Orient load memory (what worked before) and check the target is alive; Plan
  picks the next attack family to try; Attack runs it (single-shot, then multi-turn up to a max-turns cap
  to avoid infinite loops); Judge flags whether it is a real bug (done in code for now, contains /
  not-contains style, later swappable for an LLM judge); Reinforce writes results to file-based memory so
  the next episode is smarter and avoids duplicates. This first version runs with **no model inside the
  stages** at all, deliberately, as a fixed script, so the architecture lands before adding a brain. The
  planner uses **UCB1** (upper confidence bound) to balance exploiting an attack family that is winning
  against exploring ones it has not tried yet.
- **Model choice matters.** Once a real model was wired in as the attacker's brain, different models broke
  different attack categories on the same target (one local model broke a category another could not),
  and groups converged on the same reasons to prefer a local or red-team model for attacking over a
  commercial one: no ban risk, lower or no token cost, no rate limits, reproducibility (a commercial model
  can change under you), and reachability for air-gapped or regulated environments that cannot call a
  commercial API at all. Guidance on picking a model: start from the frontier labs, survey open-source
  options by downloads and variants, then compare behavior with promptfoo. A direct provider key talks to
  one model; an aggregator key (e.g. OpenRouter) talks to many through one integration, with its own
  routing logic on top.

## Tools shown
Node/npm two-terminal setup (`.env`-configured target and attacker), OpenRouter, GPT-4o Mini (demoed),
local models (RunPod-hosted Mistral 7B via Ollama / LM Studio, local Llama 3.2), Claude Code / Codex for
extending strategies, Hugging Face for model discovery, promptfoo (for comparison). Referenced as news,
not taught: a non-LLM "decision" classifier model (heard in-session as "Jeff" / a company transcribed as
"TypeSafe", with an open-source alternative).

## Exercises (paired)
1. **Run one episode** (trios, ~30 min): clone the repo fresh, bring up Mercy Bank as the target in
   terminal 1, then `npm run clean` and `npm start` the Week 3 attacker in terminal 2 with no model
   configured (hard-coded scripts only). Watch one full episode, write one line per stage, inspect the
   `campaign/` output (hits/misses, the strategy register's tries/wins per family, lessons), and answer:
   after a family wins, does the planner try it again or move on, and why?
2. **Wire in a real model** (paired, ~30 min): copy `.env.example` on the attacker, point the target URL
   at the local Mercy Bank instance plus its lab key, and set the attacker's "brain" to any
   OpenAI-compatible endpoint (OpenRouter or local). Swap between models and answer why a local or
   red-team model is often the better choice for attacking than a commercial one, plus name one attack
   family that needed the model to adapt to land, and one that still resisted.

## Homework
None between Saturday and Sunday (a deliberate rest day). The midterm survey was announced for Day 6.

*Recording + transcript shared with the cohort.*
