# Module 03: Advanced attacker (RedCell)

> **Days 7-8** · guides: [`../../days/07-redcell.md`](../../days/07-redcell.md),
> [`../../days/08-customizing-redcell.md`](../../days/08-customizing-redcell.md) · as-taught:
> [`../../session-notes/2026-10_weekend-4.md`](../../session-notes/2026-10_weekend-4.md)

**Lab target:** [`redcell/`](redcell/): RedCell, the advanced attacker agent: a ten-stage campaign
engine (wake → orient → plan → attack → judge → reinforce → verify → score → promote → report) with a
deterministic path plus an optional LLM "brain" per stage, and an HTML control dashboard. Still pointed
at MerciBank (from [`../01-manual-red-team/mercibank/`](../01-manual-red-team/mercibank/)).

Day 7 is "meet RedCell" and decoding its live-run output (objective vs family vs strategy, the bandit
planner's priority bars). Day 8 is customizing it: students rebuild the dashboard, run mock vs real
adapters, and produce a first stakeholder report. The goal is that each student ends up owning a
customized attacker of their own for their portfolio.

Run it offline (no key): `cd redcell && npm run demo`, then `node verify.mjs --adapter mock`. Against
MerciBank: start MerciBank, then `npm start` / `npm run verify`. Dashboard: `npm run dashboard`.

## Materials still to land here
The Day 7 student guide, the opening slide deck, and a staff example stakeholder report are in the
cohort Discord but not yet in the repo.
