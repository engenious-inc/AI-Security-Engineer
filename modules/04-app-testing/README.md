# Module 04: Testing an application

> **Days 9-10** · guides: [`../../days/09-new-target-recon.md`](../../days/09-new-target-recon.md),
> [`../../days/10-final-day.md`](../../days/10-final-day.md) · as-taught:
> [`../../session-notes/2026-10_weekend-5.md`](../../session-notes/2026-10_weekend-5.md)

**Lab target:** [`ai-security-chatbot/`](ai-security-chatbot/): NodeLine Tech (NLT), a fictional
cables-and-chargers store with login, chat, a RAG knowledge base and a support-ticket system, run via
Docker Compose. Intake questionnaire and ROE are in its [`docs/`](ai-security-chatbot/docs/).

The shift from attacking a bare agent to testing a full running application, the same move the sibling
repo makes in its own app-testing module. Day 9 goes back to fundamentals on the new target: intake,
recon and fingerprinting, model fingerprinting (the "LLM map" tool), OWASP LLM Top-10 / MITRE ATLAS
mapping, scripted direct prompt injection, and a home-built LLM-as-judge. Day 10 continues hands-on and
closes the cohort.

Run it: `cd ai-security-chatbot && ./launch.sh` (auto-detects hardware), app on
`http://localhost:5000`. A leaner demo attacker for this app ships in
[`ai-security-chatbot/attacker-agent/`](ai-security-chatbot/attacker-agent/).

## Materials still to land here
In the cohort Discord but not yet in the repo: the Burp Suite + FoxyProxy setup guide, the Day 9
25-technique direct-injection CSV and the injection/judge/recon scripts, and the Day 10
model-comparison script. Day 10's recording/transcript had not been posted as of Oct 12.
