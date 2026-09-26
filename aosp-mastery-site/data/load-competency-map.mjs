// Node-side loader for the competency map (plan section 9).
//
// This runs at BUILD TIME in Node (imported by docusaurus.config.js), never in
// the browser. It reads and validates data/competency-map.yaml, then returns a
// plain JSON-serializable object for use via `customFields`.
//
// It throws on structural problems so a bad map fails the build loudly rather
// than silently shipping broken content.

import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';
import {load as parseYaml} from 'js-yaml';

const here = dirname(fileURLToPath(import.meta.url));
const MAP_PATH = join(here, 'competency-map.yaml');

/** Read + parse + validate. Throws Error on any structural problem. */
export function loadCompetencyMap() {
  const raw = readFileSync(MAP_PATH, 'utf8');
  const doc = parseYaml(raw);

  if (!doc || typeof doc !== 'object') {
    throw new Error('competency-map.yaml did not parse to an object.');
  }
  if (!Array.isArray(doc.phases) || doc.phases.length === 0) {
    throw new Error('competency-map.yaml has no phases array.');
  }
  if (!Array.isArray(doc.tiers) || doc.tiers.length === 0) {
    throw new Error('competency-map.yaml has no tiers array.');
  }

  const seen = new Set();
  const errors = [];
  let competencyCount = 0;

  for (const phase of doc.phases) {
    if (!phase.id) errors.push('a phase is missing an id');
    if (seen.has(phase.id)) errors.push(`duplicate id: ${phase.id}`);
    seen.add(phase.id);

    if (!Array.isArray(phase.competencies) || phase.competencies.length === 0) {
      errors.push(`phase ${phase.id} has no competencies`);
      continue;
    }
    for (const c of phase.competencies) {
      competencyCount += 1;
      if (!c.id) errors.push(`phase ${phase.id} has a competency missing an id`);
      if (seen.has(c.id)) errors.push(`duplicate id: ${c.id}`);
      seen.add(c.id);
      if (!doc.tiers.includes(c.tier)) {
        errors.push(`competency ${c.id} has invalid tier "${c.tier}"`);
      }
      if (typeof c.artifact !== 'string' || !c.artifact.startsWith('spine/')) {
        errors.push(`competency ${c.id} artifact must start with "spine/"`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`competency-map.yaml validation failed:\n- ${errors.join('\n- ')}`);
  }

  return {
    version: doc.version,
    verifiedAgainst: doc.verifiedAgainst,
    tiers: doc.tiers,
    phases: doc.phases,
    stats: {
      phaseCount: doc.phases.length,
      competencyCount,
      idCount: seen.size,
    },
  };
}
