# Day 4 (Sun Sep 21, 2026): Attacking the agent, manual agentic attacks on Mercy Bank

Second session of Weekend 2. Hands-on day: attack the Mercy Bank agent by hand, tag each attack against the
OWASP LLM and Agentic Top 10s, and prove the findings in promptfoo. Slide title: "attack it, prove it, score
it" (scoring deferred to a later weekend). Led by Vladimir Tanev and Jaime Mantilla, hosted by Tagir Fakhriev.

**Lab target:** [`labs/week2-mercibank/`](../labs/week2-mercibank/), attacked by hand today; the Day 4
promptfoo attack suites are added to its `promptfoo/` after the session, so `git pull` for the latest.
**Next app:** [`ai-security-chatbot/`](../ai-security-chatbot/), the Docker-based store attacked from Week 4.

## What we covered
- **Recap.** A CVSS-vs-AIVSS table: CVSS for traditional, deterministic software (amplifiers: network,
  user interaction, privileges); AIVSS for autonomous, non-deterministic agents (amplifiers: autonomy,
  memory persistence, tool access). Complementary, not either/or. Plus the questionnaire, recon (paper vs
  reality), the two Top 10s, and the ROE.
- **Why manual first.** Attack manually now and tag each attack by OWASP LLM and Agentic category, because
  next week you build an agent that attacks the Mercy Bank agent and reports back through promptfoo; you must
  understand the Top 10s to instruct and verify that attacker agent.
- **Declared vs observed.** Pairs presented recon tables (API status codes for no-auth and wrong-token,
  `/health` exposing the model, tool calls as reads vs acts, a canary exposed via the Help Center store, a
  transfer refused without an OTP). You will not always get code access: an external client gives only an
  endpoint; internally you can ask developers to trace a value.
- **Where this is going.** An agent (later a swarm) that tests the agent 24/7, then user-behavior
  "personalized" attacks from real logs, then a self-learning system. Trusting a bug: re-test from a clean
  session (urgent if it reproduces from clean state), or reproduce three of three times (a tunable rule) to
  rule out hallucination; for sensitive clients, flag and test manually rather than auto-logging.
- **Assertions matter more than the model.** Several "failures" were bad assertions: a correct refusal
  failed because the test string-matched a `[blocked_by_policy]` placeholder instead of iterating a policy
  array; leakage tests carried whole-sentence `not-contains` asserts that never match. Fix fuzzy checks with
  an LLM rubric (LLM-as-judge), not deterministic `contains`.

## Tools / demos
promptfoo (single prompts, CSV and JSON multi-turn, a JavaScript multi-turn provider, LLM rubric vs
`contains`) · Postman · Claude Code / Codex / Cursor · Docker and Docker Compose · Burp Suite · RunPod
(runpod.io) · Ollama · Firefox with the FoxyProxy extension.

## Exercises (paired)
1. **Attack categories, set one** (~30 min): build a promptfoo framework with several prompts each for
   indirect prompt injection, broken access control, sensitive data exposure (multi-turn card readback), and
   excessive agency (move money without a real OTP). Document prompt, expected, and actual.
2. **Attack categories, set two** (~20 min): chain attack (reuse a leaked code to move money), system prompt
   leakage / jailbreaking (ciphers and other languages), and harmful output generation (off-domain content).
3. **Environment setup** for the Week 4 app: install Docker, Burp Suite, RunPod, Ollama, and Firefox with
   FoxyProxy, and bring the Docker-based store-with-chatbot app up locally.

## Homework
Practice the day's attack categories in promptfoo; open and understand the AI-generated assets rather than
trusting them blindly; and complete the Week 4 app setup. Step-by-step docs and the app code are pushed into
this repo, so `git pull` for the latest. Week 3 is the attacker agent (still Mercy Bank); Week 4 moves to the
bigger app.

*Recording + transcript shared with the cohort.*
