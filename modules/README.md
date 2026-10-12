# Modules

The course by **topic**, one module per weekend, mirroring the sibling
[Break-Into-AI-Testing](https://github.com/engenious-inc/Break-Into-AI-Testing) repo's `modules/`
layout. Each module folder holds its runnable lab target (plain name, no week number) plus a short
`README.md`. The day-by-day teaching guides live in [`../days/`](../days/); the fuller as-taught
record per weekend is in [`../session-notes/`](../session-notes/).

| Module | Days | Lab target | Theme |
|---|---|---|---|
| [`00-foundations/`](00-foundations/) | 1-2 | none | LLM security fundamentals, the agentic threat landscape, the role |
| [`01-manual-red-team/`](01-manual-red-team/) | 3-4 | [`mercibank/`](01-manual-red-team/mercibank/) | Scope, AIVSS, recon, then manual agentic attacks on MerciBank |
| [`02-building-an-attacker/`](02-building-an-attacker/) | 5-6 | [`simple-attacker/`](02-building-an-attacker/simple-attacker/) | Build an attacker agent, then verify/gate/promote to promptfoo |
| [`03-advanced-attacker/`](03-advanced-attacker/) | 7-8 | [`redcell/`](03-advanced-attacker/redcell/) | RedCell, the advanced attacker agent + dashboard; customize it, report |
| [`04-app-testing/`](04-app-testing/) | 9-10 | [`ai-security-chatbot/`](04-app-testing/ai-security-chatbot/) | A new running application (NodeLine Tech): recon, scripted injection |

Module 04 is the shift the sibling repo also makes in its own Module 3: testing a full running
application, not a bare model, after the earlier modules attack a single agent.

> ⚠️ Every lab target here is **intentionally vulnerable** and built for authorized testing on your
> own machine. Never deploy one, and never point your harness at a system you are not authorized to
> test. Read each lab's `rules-of-engagement.md` first.

## Status
Modules 01-03's labs are instructor-written and run. Module 04's app is instructor-written; its
Day 9-10 teaching write-ups are drafts pending review (see the day guides). The module `README.md`
files are the natural home for the student guides and decks that are still only in Discord.
