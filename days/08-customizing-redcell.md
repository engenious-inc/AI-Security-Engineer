# Day 8 (Sun Oct 4, 2026): Customizing RedCell and the first stakeholder report

Weekend 4. **Lab:** [`labs/attacker-pro/`](../labs/attacker-pro/)

Second session of Weekend 4. Tagir Fakhriev ran the breakout rooms (no Igor Dorovskikh today); Jaime
Mantilla and Vladimir Tanev led the lecture and demos. Several attendees were again listen-only, and one
student had not done the homework. Framing: Mercy Bank, the basic attacker, and now RedCell are all a
starting point, not what you will use on the job; fluency with an AI coding assistant is treated as a
must.

## What we covered
- **Opening.** Enterprises are increasingly moving to open-weight models hosted in their own cloud as
  commercial token prices rise, often behind a proxy router that sends simple tasks to cheap models and
  harder ones to stronger models, with production-facing features staying on a locked model.
- **Customized dashboards, show-and-tell.** Students presented their own modified RedCell dashboards: a
  glossary and architecture doc with planner rankings shown in place of the raw priority bars; a campaign
  dropdown, status bars, a ranking-formula display, a table view of the event log, and a merge of one
  student's own audit framework (with its verification table) into RedCell; smaller fixes including
  hover explanations per strategy, percentages and "tries / succeeded" instead of raw pulls/wins, "round"
  instead of "episode" with a plain goal description, and a fix for a bug where both the confirmed and
  rejected versions of the same finding showed up.
- **Peer-led breakouts.** Two rooms, each led by a student who had built a significant RedCell extension,
  walking the group through how they used their AI coding assistant to make the changes. One student
  built search, filters and a jump-to-latest/tail mode for the event logger live in about 20 minutes,
  starting from asking the assistant what it would improve; Vladimir noted this student was driving the
  assistant through a browser-automation integration so it could click through and verify its own UI
  changes.
- **Mock vs real adapter.** The mock is a scripted demo target that costs no tokens; one group's
  Base64-encoded attack landed on the mock but failed against the live Mercy Bank, because the real model
  decoded the payload, reasoned about intent, and declined. Used as a teaching example of exactly why the
  mock exists: it guarantees a hit to study even when the real target holds.
- **Per-stage models and judge design.** The dashboard currently runs one model across every stage; the
  stated direction is to make recon, strategist, attacker and judge selectable separately, often with
  smaller models, and possibly a non-generative "decision" classifier model for judging rather than a
  general LLM.
- **A cost-cutting path, named for later, not this cohort.** Collect good input/output samples from a
  strong model, expand them into more synthetic samples with another model, and train a small model to
  swap into one stage; Vladimir experiments with this on Modal.
- **One agent per target vs one general agent.** The guidance that landed: one shared technical
  foundation with domain-specific content layered per target (a "swarm" pattern), which mirrors how the
  instructors' own employer adapts agents to clients, starting from the intake questionnaire.
- **First stakeholder report.** Students were asked to present findings as if to a C-level audience:
  rates and risk levels (e.g. "credit card leaked 30% of the time"), which areas are high vs low risk,
  what to fix, in any format. Only one student presented: she had an agent merge her campaign reports
  into a PDF, used an AI assistant to fix the layout and check it against stakeholder-reporting practices,
  and asked it for talking points. Her top finding, money transfers going through without an OTP, was
  ranked above its AIVSS score on judgment.
- **Next weekend's target, previewed.** The NodeLine Tech ticketing app (a fictional cables-and-chargers
  store, run via Docker): login, chat, and tickets with urgency and status. An indirect prompt injection
  planted in a ticket subject line was demonstrated (a hidden instruction meant to make the assistant act
  on an unrelated later request), then the same request was intercepted and replayed with a proxy tool, as
  exposure-only context rather than deep exploitation. Manual attacks, the ROE and the intake questionnaire
  for this target were set for the next weekend.

## Tools shown
Customized RedCell dashboards, Claude Code (CLI and editor panel, including running shell commands inline
so output lands in its context), Claude in Chrome, ChatGPT, promptfoo, OpenRouter / GPT-4o Mini, Postman,
Burp Suite Community with FoxyProxy in Firefox, Docker, Modal, Anthropic's Skilljar courses (Claude Code
101 / Claude Code in action).

## Exercises (paired)
1. **Peer-led breakout** (~30 min): two groups, each walked through how a lead student used their AI
   coding assistant to extend RedCell.
2. **Block 3, mock then real** (3A/3B, ~30 min): run the same attack block first against RedCell's mock
   adapter, then against the live Mercy Bank target, and compare where results diverge.
3. **Block 4 plus first stakeholder report** (~30 min, merged with Block 3 to save time): present
   findings as you would to a C-level audience, in any format.

## Homework
Explore the NodeLine Tech ticketing app as a normal user (exploratory testing: payload shape, response
fields and times, ticket IDs, whether there is RAG, whether there are tools); try indirect prompt injection
through tickets; plan how you would build or adapt an attacker agent for it; set up Burp Suite and FoxyProxy
(a configuration guide was promised); read the ROE and the intake questionnaire for the new target; finish
the stakeholder report if you did not present; keep practicing with your AI coding assistant.

*Recording + transcript shared with the cohort.*
