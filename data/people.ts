// The hand-curated dataset that pre-dated the Codex enrichment pass. The Codex
// output in `data/by-type/*.ts` is comprehensive and uses the canonical Civ V
// name pool, so we emit an empty list here to avoid dupes like:
//   "Wolfgang Amadeus Mozart" (curated) vs "Wolfgang Mozart" (Civ V ground truth)
//   "Vincent van Gogh"        (curated) vs "Vincent Van Gogh"   (Civ V ground truth)
// Kept as a file (rather than deleted) so the existing `import { PEOPLE } from "./people"`
// in `data/index.ts` doesn't break. To re-add bespoke entries, just push them here.

import type { Person } from "./people-types";
export type { Person } from "./people-types";

export const PEOPLE: Person[] = [];
