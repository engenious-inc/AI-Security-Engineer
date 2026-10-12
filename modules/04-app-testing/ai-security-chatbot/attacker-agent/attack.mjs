// attack.mjs — run a ChatRaider campaign (the rich-terminal entry point).
//
//   node attack.mjs                 # default: target http://localhost:5000
//   TARGET_URL=http://localhost:5050 node attack.mjs
//
// Targets localhost by default; non-localhost needs ROE_AUTHORIZED=1 + TARGET_ALLOWLIST.
// See rules-of-engagement.md.

import './lib/env.mjs';
import { runCampaign } from './lib/engine.mjs';
import { banner, c } from './lib/ui.mjs';

banner('ChatRaider — attacker agent for ai-security-chatbot', 'Startup → Setup → (Attack → Check → Record) × 5   — authorized lab only, see rules-of-engagement.md');

runCampaign({})
  .then(({ found }) => {
    console.log('\n  ' + (found.length ? c.g(`${found.length} candidate(s) banked.`) : c.y('no candidates this run.')) + c.dim('  Run: node verify.mjs\n'));
  })
  .catch((e) => { console.error('\n  ' + c.r('fatal: ' + e.message) + '\n'); process.exit(1); });
