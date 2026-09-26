import React from 'react';
import clsx from 'clsx';
import {TimeEstimate, DifficultyBadge} from '@site/src/components/Unit';
import styles from './styles.module.css';

/**
 * Combined phase header showing tier, time estimate, and difficulty at a glance.
 *
 * Usage:
 *   <PhaseHeader tier="Builder" time={4} difficulty="intermediate" />
 *
 * `tier` matches the competency-map tiers: Recruit | Builder | Engineer | Architect | Master.
 * `time` is estimated hours.
 * `difficulty` is beginner | intermediate | advanced.
 */

const TIER_COLORS = {
  Recruit: styles.tierRecruit,
  Builder: styles.tierBuilder,
  Engineer: styles.tierEngineer,
  Architect: styles.tierArchitect,
  Master: styles.tierMaster,
};

function TierBadge({tier}) {
  return (
    <span className={clsx(styles.tierBadge, TIER_COLORS[tier])}>
      {tier}
    </span>
  );
}

export function PhaseHeader({tier, time, difficulty}) {
  return (
    <div className={styles.phaseHeader}>
      {tier && <TierBadge tier={tier} />}
      {time && <TimeEstimate hours={time} />}
      {difficulty && <DifficultyBadge level={difficulty} />}
    </div>
  );
}

export default PhaseHeader;
