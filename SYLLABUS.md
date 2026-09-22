# AI Security track - syllabus (draft, built on the go)

Reconstructed from the live weekend sessions (the Day 1 and Day 2 transcripts) and the cohort
Discord. There is no pre-existing AI Security curriculum; this is the first cohort and the
syllabus is written as it is taught. **Draft for the security instructors (Vladimir and Jaime) to
validate and extend.**

- **Track:** AI Security Engineer - Red Teaming & Agentic AI Defense
- **Format:** 5 weeks / 10 days, Sat + Sun live; alumni-only advanced follow-on
- **Captured so far:** Weekend 1 (Days 1-2) and Weekend 2 (Days 3-4). Later sessions are added here after they run.

## Prerequisites & tools (as used in the sessions)
Prior AI Testing / Evaluations cohort or equivalent promptfoo red-team experience · promptfoo ·
Node · Python · Git + terminal · an AI coding assistant (Claude Code / Codex).

## Weekend 1

### Day 1 (Sat Sep 12) - Foundations recap & hands-on red-team
LLM fundamentals through a security lens: tokens (encoding tricks), context window (overload,
hidden injection, truncation), system prompt (expose then modify to extract), temperature, and
model fingerprinting. Recap of the promptfoo essentials. Two paired exercises: "break your own
chatbot", then a higher-stakes audit of a system with sensitive-data access. Full guide:
[`days/01-foundations-recap.md`](days/01-foundations-recap.md).

### Day 2 (Sun Sep 13) - The playbook: agents, the threat landscape & the role
Lecture/roundtable day. AI history → agents → swarms; anatomy of an agent (tools, MCP, Skills,
RAG, memory, A2A, orchestrators, sandbox); skill/tool-description poisoning; the shift from
static testing to system assurance; reading the job market. Full guide:
[`days/02-the-playbook.md`](days/02-the-playbook.md).

## Weekend 2

### Day 3 (Sat Sep 20): Scoping the target, AIVSS, intake & recon
The pre-attack day. Homework show-and-tell, then AIVSS (why CVSS cannot score agents, and how AIVSS
complements it with 10 factors scored 0 / 0.5 / 1), the intake questionnaire (decision tree, declared vs
observed) for the hypothetical client Mercy Bank, rules of engagement (what makes testing legal), and recon
plus fingerprinting: connecting to the local MerciBank lab (`labs/week2-mercibank/`, localhost:8080,
`/v1/chat/completions`), and using Claude Code or Codex to read the codebase. Full guide:
[`days/03-scoping-the-target.md`](days/03-scoping-the-target.md).

### Day 4 (Sun Sep 21): Attacking the agent, manual agentic attacks on Mercy Bank
Hands-on attack day. Recap (a CVSS-vs-AIVSS table), the declared-vs-observed recon discussion, then manual
attacks on Mercy Bank tagged against the OWASP LLM and Agentic Top 10s: indirect prompt injection, broken
access control, sensitive data exposure, excessive agency, chain attacks, system prompt leakage, and harmful
output generation, all built into a promptfoo framework. A recurring lesson on writing correct assertions
(LLM rubric vs deterministic `contains`, and not trusting AI-generated asserts). Setup walkthrough for the
Week 4 app (Docker, Burp Suite, RunPod, Ollama, Firefox with FoxyProxy). Full guide:
[`days/04-attacking-the-agent.md`](days/04-attacking-the-agent.md).

## Named but not yet scheduled
Topics the instructors said the course will cover, in no fixed order yet:
- **AIVSS scoring** (the AIVSS site + calculator): the model and factors were taught in Weekend 2 (Day 3);
  applying the scoring formula and calculator to findings is deferred to a later weekend.
- **Attacker agent** (an agent that attacks the Mercy Bank agent and reports test cases back through
  promptfoo): named for Week 3.
- **The Week 4 app** (`ai-security-chatbot/`, a Docker-based store with chat, RAG, and a ticketing system;
  tools: Docker, Burp Suite, RunPod, Ollama, Firefox with FoxyProxy): setup started Weekend 2, attacked from Week 4.
- **User-behavior / personalized attack agents** and a **self-learning testing system**: named for later
  weeks (Vladimir, Week 4-5).
- LLM + RAG attacks
- MCP / tool-use testing
- Adaptive attacks
- Red-team campaign design

Days 5-10 will be filled in here after each weekend runs. This section stays unordered until the
instructors set the sequence.

## Standing components (every weekend, from the sessions)
- Career track: exercises tied to interview questions; live job-post reads; public posting (LinkedIn).
- Practice cadence: weekday homework + Discord study groups.
- Reading referenced: Jason Arbon "Testing AI", Steve Wilson "The Developer's Playbook for LLM Security", OWASP LLM Top-10, AIVSS.
