# AI Security Engineer

Red Teaming & Agentic AI Defense. Hands-on AI security course: red-teaming LLMs and agentic systems, prompt injection, tool/skill poisoning, and AI system assurance with promptfoo.

> **Status: under construction, built weekend by weekend.** This is the first AI Security cohort (Sep 2026), an advanced follow-on for alumni of the AI Testing / Evaluations track. The curriculum is being written as it is taught, so this repo grows after each session rather than shipping complete. Nothing here is a finished spec yet.

## What's here
- **[SYLLABUS.md](SYLLABUS.md)**: the one-page curriculum overview, day by day, with status and links
  into `days/` and `session-notes/`. Start here for a skim of the whole course.
- **[days/](days/)**: one guide per teaching session, organised by day as it is taught (mirrors the
  sibling repo's `days/`, which organises its lessons by session too). Days 1-4 are instructor-written.
  Days 5-9 are a **draft reconstructed from the session transcripts, pending Vladimir and Jaime's
  review**, see each file's note. Day 10 is not yet written: its transcript has not been posted.
- **[session-notes/](session-notes/)**: the fuller as-taught record per weekend (Weekends 1-5, Day 10
  pending), one level more detailed than the `days/` guides.
- **[labs/](labs/)**: the runnable lab targets by week (MerciBank, the Week 3 attacker agent, RedCell)
  plus the Week 5 NodeLine Tech app in [ai-security-chatbot/](ai-security-chatbot/). This track's shape
  is one escalating target plus evolving attacker tooling, rather than per-topic apps, so labs live at
  the top level instead of nested under `modules/` the way the sibling repo nests PayFlow/FinanceBot.
- **[modules/](modules/)** and **[docs/](docs/)**: placeholders for now; the lesson/module breakdown
  (mirroring the sibling repo's topic-based `modules/` + exercise `docs/`) is to be defined by the
  instructors once the as-taught content above has been reviewed.

## Prerequisites & toolkit (as used in the sessions)
Prior AI Testing / Evaluations cohort, or equivalent promptfoo red-team experience. Core tools used so far: promptfoo, Node, Python, Git, and an AI coding assistant (Claude Code / Codex). Runnable eval suites and setup scripts will be added here as the course builds them; the course uses promptfoo and can point at the sibling course's apps as targets.

## Sibling
Companion to [Break-Into-AI-Testing](https://github.com/engenious-inc/Break-Into-AI-Testing).
