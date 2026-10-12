# Day 9 (Sat Oct 10, 2026): A new target: NodeLine Tech recon and testing

Weekend 5. **Lab:** [`modules/04-app-testing/ai-security-chatbot/`](../modules/04-app-testing/ai-security-chatbot/)

> **Syllabus note:** the original plan named Day 9 "red-team campaign design + adaptive attacks." As
> taught, Day 9 went back to fundamentals on the new target instead: intake, recon, fingerprinting, and
> scripted direct injection, explicitly framed as "before promptfoo existed." See the syllabus update for
> the full note.

First session of Weekend 5, the final weekend. Low turnout (a vocal group of about five). Led by Jaime
Mantilla (demos, exercises, debriefs) with tips from Vladimir Tanev; Tagir Fakhriev ran the breakout rooms.
No Igor Dorovskikh (joining Day 10 instead). Framed as repeating Weeks 1-2's shape on a new application:
intake and ROE, attack surface, recon and fingerprinting, then manual attacks, scripted attacks and
reports, on the **NodeLine Tech (NLT)** ticketing app (`ai-security-chatbot/`), introduced at the end of
Day 8.

## What we covered
- **Opening: a career signal.** Jaime shared a role that had reached out to him: a "regular" test
  automation engineer title whose duties now include AI evaluation: confidence-threshold assertions,
  semantic-similarity checks, rubric-based validation, golden benchmark datasets, hallucination and
  groundedness testing, regression detection across model and prompt versions, and AI test coverage
  across accuracy, robustness, bias, safety, performance and reliability.
- **Homework show-and-tell.** Two students had already started adapting RedCell to NLT ahead of class,
  one with NLT-specific attack strategies and a working run. Open problems discussed: how to test an
  agent that enforces role-based permissions (admin vs. customer accounts) rather than a flat chat model,
  and keeping a coding assistant "under control": tips traded included scoping requests explicitly,
  asking for a read-only review before changes, and writing a handoff summary before a session's context
  window runs out.
- **Frameworks.** The **OWASP Top 10 for LLM Applications** (2025 edition, plus a 2026 edition a student
  shared) mapped onto the remaining exercises: prompt injection (direct and indirect), sensitive
  information disclosure, improper output handling, excessive agency, system prompt leakage, a
  RAG-related item, and misinformation / hallucination. **MITRE ATT&CK** (traditional IT/cloud/enterprise
  adversary tactics) alongside its AI counterpart **MITRE ATLAS**, including its "feasible / demonstrated
  / realized" maturity filter. A first row of an OWASP-to-NLT attack-surface mapping was worked through
  live as a model for students to continue.
- **Model fingerprinting.** An open-source tool, "LLM map" (compared to nmap), asks a fixed set of
  questions against a target chat and predicts the underlying model from pre-trained profiles, on the
  logic that knowing the model (and whether it is an older, less-hardened version) points to known
  weaknesses, the same way an outdated plugin would. Results varied across students: one run misidentified
  the target model, another identified it correctly, and one student scripted the whole probe-and-feed
  loop with a coding assistant instead of copying answers by hand.
- **Direct prompt injection, manual then scripted.** Working from a reference list of about two dozen
  direct-injection technique categories (compiled by the instructors for the course), students tried a few
  by hand in the UI, then wrote a script that sends each technique to the target chat and logs the
  response for later review. Technique categories named: instruction override, debug-mode activation,
  role switching, multi-step extraction, reverse-psychology framing, system-tag spoofing,
  verbatim-repetition requests, continuation-style attacks, model-specific instruction-format tricks,
  session-reset framing, and simulation / "test mode" framing.
- **Building an LLM-as-judge from scratch.** Students had their coding assistant write a script that reads
  the injection results and adds a verdict column (succeeded or not), a confidence score, and a one-line
  reason, modeled on the kind of rubric promptfoo's LLM-as-judge assertions use. Debrief surfaced real
  judge problems: unhandled newlines breaking downstream parsing; two local judge models disagreeing on
  the same results; and the standing question of how to guard against a judge that itself hallucinates,
  answered with "use a stronger or newer judge model, review every row as a human given the small sample,
  and rerun with a second judge model to compare."

## Tools shown
The NodeLine Tech ticketing app (Docker Compose), RunPod, Ollama (Phi-3 Mini, Mistral 7B, Granite 3.1),
Burp Suite (Proxy, Intercept, Repeater) with FoxyProxy in Firefox, Postman, the "LLM map" fingerprinting
tool, Python virtual environments, the OWASP Top 10 for LLM Applications, MITRE ATT&CK, MITRE ATLAS,
promptfoo (referenced, not run), Claude Code, Cursor (Composer), Codex, ChatGPT, RedCell (students' own
NLT adapters).

## Exercises (paired)
1. **Manual recon and fingerprinting** (~20 min): using NLT's intake questionnaire and ROE, map the model
   and its characteristics, whether there is a RAG component, whether the system prompt or its details can
   be surfaced, how deterministic responses are, context-window size, any tool / agentic capability, rate
   limits, and handling of special characters and encoding. Includes a Burp Suite + FoxyProxy walkthrough:
   intercept a chat message, send it to Repeater, edit and resend, and reuse the session cookie and
   conversation ID across tabs for multi-turn probing.
2. **Model fingerprinting** (~10 min planned): run the "LLM map" tool against the target chat by pasting
   its fixed set of questions in and its answers back, to predict the underlying model.
3. **Direct prompt injection, manual then scripted** (~20 min): try a handful of the reference technique
   categories by hand, then write a script that runs the full reference list against the target and writes
   results to a file.
4. **Build an LLM-as-judge from scratch** (~20 min): extend the results script so a model grades each
   attempt as succeeded or not, with a confidence score and a reason.

## Homework
Run the "LLM map" tool against the NLT chat if not done, and optionally automate or extend it; review the
OWASP Top 10 for LLM Applications and the MITRE ATLAS matrix and map what the course has covered onto
them; finish the injection script and its judge and commit both; post a screenshot of your first prompt
for the group to compare approaches; post resumes and target roles in Discord. Be ready for the final day:
indirect prompt injection through the UI continues, and Igor joins to cover next steps.

*Recording + transcript shared with the cohort.*
