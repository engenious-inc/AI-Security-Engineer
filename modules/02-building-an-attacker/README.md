# Module 02: Building an attacker agent

> **Days 5-6** · guides: [`../../days/05-attacker-agent.md`](../../days/05-attacker-agent.md),
> [`../../days/06-closing-the-loop.md`](../../days/06-closing-the-loop.md) · as-taught:
> [`../../session-notes/2026-09_weekend-3.md`](../../session-notes/2026-09_weekend-3.md)

**Lab target:** [`simple-attacker/`](simple-attacker/): a small attacker agent that runs a campaign
against MerciBank (from [`../01-manual-red-team/mercibank/`](../01-manual-red-team/mercibank/)), then
verifies and promotes its findings into a promptfoo regression suite.

The automation turn: Week 2 attacked MerciBank by hand, this weekend builds the thing that does it for
you. Day 5 builds the six-stage episode loop (Wake → Orient → Plan → Attack → Judge → Reinforce) with a
UCB1 planner, run first as a fixed script and then with a real model as the attacker's "brain." Day 6
closes the loop: `verify` reproduces each hit 3× from fresh sessions, a 3-of-3 gate confirms or drops
it, and confirmed findings auto-promote to promptfoo YAML.

Run it (two terminals): MerciBank in one (see Module 01), then in `simple-attacker/`:
`cp .env.example .env`, `npm run clean`, `npm start` (Day 5), `npm run verify` (Day 6).

## Materials still to land here
The Day 5 and Day 6 student-guide PDFs are in the cohort Discord but not yet in the repo.
