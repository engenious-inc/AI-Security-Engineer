# Day 6 (Sun Sep 27, 2026): Closing the loop: verify, gate, promote to promptfoo

Weekend 3. **Lab:** [`modules/02-building-an-attacker/simple-attacker/`](../modules/02-building-an-attacker/simple-attacker/)

Second session of Weekend 3. Run mostly as trio breakouts with less lecturing. Led by Vladimir Tanev
(Jaime Mantilla out again this weekend), with Igor Dorovskikh opening and hosting. The midterm survey was
posted in the Day 6 thread and filled live at the start of class.

## What we covered
- **A student finding via Garak.** A goal-hijacking prompt injection on Mercy Bank, found with NVIDIA's
  Garak scanner run slowly and within the rules of engagement (not the tool's default of hundreds of
  requests), made the bot print attacker-controlled text once the payload was adapted to the target.
  Garak (an outside red-team / assessment kit, suited to a pen-tester with no internal access) was
  contrasted with promptfoo (more universal, better when you own the system); Engenious uses Garak
  professionally.
- **A real-world incident, cited as interview material.** Vladimir referenced an OpenAI disclosure about
  agents posting user-uploaded images to third-party hosting sites in a number of cases, as the kind of
  real incident to bring up in interviews: the risk is not just training-data opt-outs but models and
  agents *acting* on and exfiltrating data. (This is an instructor's in-session characterization of a
  news item, not independently verified here.)
- **Custom attack strategies.** A strategy is an object combining an opening message, escalation /
  follow-up turns, an attack family, OWASP IDs, and a goal the judge must prove. Students added a custom
  strategy each and re-ran the agent against categories that had resisted on Day 5; one student broke the
  chaining category that had held the day before by adding an extra chaining strategy, using an AI coding
  assistant's planning mode to draft it.
- **Closing the loop: verify, gate, promote.** `npm run verify` re-runs each candidate finding **three
  times in parallel, each from a fresh session** (a warmed-up session could already hold a canary value in
  context and fake a leak), and a gate (default **3-of-3**) decides whether a finding is confirmed and
  promoted, or rejected. Confirmed findings are auto-written as **promptfoo YAML regression files**, ready
  to feed a CI/CD regression suite or hand to a client as reproduction steps.
- **The gate is a judgment call, not just a number.** Loosening the reproduction bar (e.g. 3-of-5 instead
  of 3-of-3) quietly lowers the real confirmation threshold to 60%, not the same as a strict 3-of-3. One
  finding that reproduced only around 55% of the time over 100 runs was still judged worth reporting
  because of its impact: frequency sets priority among findings of similar impact, but impact can
  outweigh frequency on its own (a rare but critical leak still ships ahead of a frequent low-severity one).
- **Reading the verify code.** A baseline check (does the issue reproduce without the attacker agent at
  all, i.e. is it agentic or just a property of the underlying model) is skipped and logged as such when
  no attacker model is wired in; the "impact" rating is currently a hard-coded lookup table, not an
  algorithm. Confirmed as deliberately simple for now, with the plan to replace both with an agent that
  judges impact and verdict later.
- **Portfolio / GitHub guidance.** A well-organized GitHub repo is treated as the primary hiring asset: a
  branch per exercise, several clear commit messages per exercise, one README with a running changelog
  (not a README per branch), old branches kept so an interviewer can walk the timeline, and run results
  demoed live rather than committed. Hiring teams increasingly review repo history, often by running an AI
  agent over it.
- **Teaching friction, named by the instructors themselves.** The exercise asking students to pick their
  strongest finding to promote confused several students: it is a manual, subjective judgment call (which
  finding matters most to the business), not a single right answer. Both instructors conceded the
  exercise framing needs rework, and Vladimir said he will likely merge it with the verify/gate step for
  the next cohort so students go straight from the gate to promptfoo and see the payoff.

## Tools shown
The Week 3 attacker-agent stack (Node/npm, `.env`, two terminals), OpenRouter and local models (GPT-4o
Mini, Mistral 7B, Llama 3.2), promptfoo, NVIDIA Garak, an AI coding assistant's planning mode, Postman.

## Exercises (paired)
1. **Add a custom strategy** (opening message, escalation, family, OWASP IDs, a goal the judge must
   prove) to the agent, run it, confirm it shows up in a new episode, then tune the episode / max-turns
   settings to try to crack a category that held on Day 5.
2. **Verify, gate, promote**: read the gate output for your strongest finding line by line, then promote
   it into a promptfoo regression file, closing the loop from a gated finding to a CI/CD-ready test.

## Homework
For the week (revisited next Saturday): redo the custom-strategy and verify/gate/promote blocks from
scratch, but go further than the written steps (explore, change code, add a model to the judge, break
and re-clone freely). Core task: take gated findings and report them into promptfoo so a CI/CD suite
guards against regressions. AIVSS scoring ("score and ship") is lower priority and points back to the
Day 2/3 explanation; it was not reached live this weekend.

*Recording + transcript shared with the cohort.*
