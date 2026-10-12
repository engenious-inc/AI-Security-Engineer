// verify.mjs — CLI for the VERIFY stage (shared logic in lib/verify.mjs, so the dashboard runs the
// exact same code).
//   node verify.mjs                   # verify every finding on record
//   REPRO_MIN=1 node verify.mjs       # loosen the bar (watch a probabilistic finding flip)

import './lib/env.mjs';
import { runVerify } from './lib/verify.mjs';
import * as mem from './lib/memory.mjs';
import { banner, findingsTable, c } from './lib/ui.mjs';

banner('ChatRaider — VERIFY', `confidence threshold ${process.env.REPRO_MIN || 2}/${process.env.REPRO_RUNS || 3}`);
runVerify({})
  .then(({ confirmed, candidates }) => {
    if (!candidates.length) { console.log(c.y('\n  No findings. Run `node attack.mjs` first.\n')); return; }
    findingsTable(candidates);
    console.log(`\n  ${c.bold('confirmed:')} ${c.g(confirmed.length)}/${candidates.length}  → ${c.dim(mem.paths.FINDINGS)}\n`);
  })
  .catch((e) => { console.error('\n  ' + c.r('fatal: ' + e.message) + '\n'); process.exit(1); });
