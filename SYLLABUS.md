# AI Security track - syllabus overview

One-page curriculum overview, day by day. The day-by-day teaching guides are in
[`days/`](days/); the fuller as-taught record per weekend is in [`session-notes/`](session-notes/).
This is the first AI Security cohort (Sep-Oct 2026), an advanced follow-on for alumni of the AI
Testing / Evaluations track; the curriculum is written as it is taught, so this page grows after each
session rather than shipping complete.

- **Track:** AI Security Engineer - Red Teaming & Agentic AI Defense
- **Format:** 5 weekends / 10 days, Sat + Sun live; alumni-only advanced follow-on
- **Status:** Days 1-9 are the as-taught record of the sessions. Day 10 is not yet written: its
  recording has not been posted.

## Prerequisites & tools (as used in the sessions)
Prior AI Testing / Evaluations cohort or equivalent promptfoo red-team experience · promptfoo ·
Node · Python · Git + terminal · an AI coding assistant (Claude Code / Codex).

## Weekend 1

### Day 1 (Sat Sep 12) - Foundations recap & hands-on red-team
LLM fundamentals through a security lens: tokens (encoding tricks), context window (overload, hidden
injection, truncation), system prompt (expose then modify to extract), temperature, and model
fingerprinting. Recap of the promptfoo essentials. Two paired exercises: "break your own chatbot," then
a higher-stakes audit of a system with sensitive-data access. Guide:
[`days/01-foundations-recap.md`](days/01-foundations-recap.md).

### Day 2 (Sun Sep 13) - The playbook: agents, threat landscape & the role
Lecture/roundtable day. AI history to agents to swarms; anatomy of an agent (tools, MCP, Skills, RAG,
memory, A2A, orchestrators, sandbox); skill/tool-description poisoning; the shift from static testing
to system assurance; reading the job market. Guide: [`days/02-the-playbook.md`](days/02-the-playbook.md).

## Weekend 2

### Day 3 (Sat Sep 19): Scoping the target, AIVSS, intake & recon
The pre-attack day. Homework show-and-tell, then AIVSS (why CVSS cannot score agents, and how AIVSS
complements it with 10 factors scored 0 / 0.5 / 1), the intake questionnaire (decision tree, declared
vs observed) for the hypothetical client Mercy Bank, rules of engagement, and recon plus fingerprinting
against the local MerciBank lab. Guide: [`days/03-scoping-the-target.md`](days/03-scoping-the-target.md).

### Day 4 (Sun Sep 20): Attacking the agent, manual agentic attacks on Mercy Bank
Hands-on attack day: manual attacks on Mercy Bank tagged against the OWASP LLM and Agentic Top 10s
(indirect prompt injection, broken access control, sensitive data exposure, excessive agency, chain
attacks, system prompt leakage, harmful output generation), built into a promptfoo framework. A
recurring lesson on writing correct assertions. Setup walkthrough for the Week 4 app. Guide:
[`days/04-attacking-the-agent.md`](days/04-attacking-the-agent.md).

## Weekend 3

### Day 5 (Sat Sep 26): Building an attacker AI agent
A six-stage episode engine (Wake/Orient/Plan/Attack/Judge/Reinforce) with a UCB1 planner, run first as
a fixed script with no model, then with a real model wired in as the attacker's "brain." Guide:
[`days/05-attacker-agent.md`](days/05-attacker-agent.md).

### Day 6 (Sun Sep 27): Closing the loop: verify, gate, promote to promptfoo
Custom attack strategies, then the verify/gate/promote loop (`npm run verify`: 3 fresh-session reruns,
a 3-of-3 gate, auto-promotion to promptfoo regression YAML) and the judgment call behind the gate
(impact vs frequency). Guide: [`days/06-closing-the-loop.md`](days/06-closing-the-loop.md).

## Weekend 4

### Day 7 (Sat Oct 3): RedCell, the advanced attacker agent and its dashboard
Meet RedCell: a ten-stage loop (wake, orient, plan, attack, judge, reinforce, verify, score, promote,
report) and its HTML dashboard; decoding the live-run output (objective vs family vs strategy, the
bandit planner's priority bars). Guide: [`days/07-redcell.md`](days/07-redcell.md).

### Day 8 (Sun Oct 4): Customizing RedCell and the first stakeholder report
Student-customized dashboards, mock vs real adapter testing, and the first findings report pitched as
to a C-level audience. NodeLine Tech, next weekend's target, previewed with an indirect-injection demo.
Guide: [`days/08-customizing-redcell.md`](days/08-customizing-redcell.md).

## Weekend 5

### Day 9 (Sat Oct 10): A new target: NodeLine Tech recon and testing
A new target, back to fundamentals: intake, recon and fingerprinting, model fingerprinting with the
"LLM map" tool, OWASP LLM Top-10 / MITRE ATLAS mapping, scripted direct prompt injection, and a
home-built LLM-as-judge. **Diverges from the original plan** (see the note in the guide): taught as
fundamentals-on-a-new-target, not "campaign design + adaptive attacks." Guide:
[`days/09-new-target-recon.md`](days/09-new-target-recon.md).

### Day 10 (Sun Oct 11): Final day *(not yet written: no transcript posted)*
Planned to continue indirect prompt injection through the NodeLine Tech UI, with Igor Dorovskikh
covering next steps for the cohort. Guide: [`days/10-final-day.md`](days/10-final-day.md).

## Not yet covered
- **AIVSS scoring**: the model and factors were taught in Weekend 2 (Day 3); applying the scoring
  formula and calculator to findings was deferred again in Weekend 3 (Day 6) and not reached live
  through Day 9.
- **User-behavior / personalized attack agents** and a **self-learning testing system**: named for
  later weeks, not covered in class through Day 9.
- **LLM + RAG attacks**: Day 9 covered recon on whether a target has RAG, but not RAG-specific attack
  technique.
- **MCP / tool-use testing**: touched only as "map the chat AI's functions" during recon.

## Standing components (every weekend, from the sessions)
- Career track: exercises tied to interview questions; live job-post reads; public posting (LinkedIn).
- Practice cadence: weekday homework + Discord study groups.
- Reading referenced: Jason Arbon "Testing AI," Steve Wilson "The Developer's Playbook for LLM
  Security," OWASP LLM Top-10, AIVSS.
