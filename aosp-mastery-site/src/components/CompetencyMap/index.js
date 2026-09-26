import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

/**
 * Renders the competency map (plan section 9) loaded from
 * siteConfig.customFields.competencyMap. The data is parsed and validated at
 * build time in Node (data/load-competency-map.mjs); this component only
 * presents it. No Android commands or curriculum text live here.
 */

const TIER_ORDER = ['Recruit', 'Builder', 'Engineer', 'Architect', 'Master'];
const TIER_CLASS = {
  Recruit: styles.tierRecruit,
  Builder: styles.tierBuilder,
  Engineer: styles.tierEngineer,
  Architect: styles.tierArchitect,
  Master: styles.tierMaster,
};

function TierBadge({tier}) {
  return (
    <span className={clsx(styles.tierBadge, TIER_CLASS[tier])}>{tier}</span>
  );
}

export default function CompetencyMap() {
  const {siteConfig} = useDocusaurusContext();
  const map = siteConfig.customFields.competencyMap;
  const [filter, setFilter] = useState('all');

  const visiblePhases = useMemo(() => {
    if (filter === 'all') return map.phases;
    return map.phases.filter((p) =>
      p.competencies.some((c) => c.tier === filter),
    );
  }, [map.phases, filter]);

  return (
    <div className={styles.wrap}>
      <p className={styles.meta}>
        <strong>{map.stats.phaseCount}</strong> phases &middot;{' '}
        <strong>{map.stats.competencyCount}</strong> competencies &middot;
        verified against <code>{map.verifiedAgainst}</code>
      </p>

      <div className={styles.filters}>
        <button
          type="button"
          className={clsx(
            'button button--sm',
            filter === 'all' ? 'button--primary' : 'button--secondary',
          )}
          onClick={() => setFilter('all')}>
          All tiers
        </button>
        {TIER_ORDER.map((t) => (
          <button
            key={t}
            type="button"
            className={clsx(
              'button button--sm',
              filter === t ? 'button--primary' : 'button--secondary',
            )}
            onClick={() => setFilter(t)}>
            {t}
          </button>
        ))}
      </div>

      {visiblePhases.map((phase) => {
        const shown =
          filter === 'all'
            ? phase.competencies
            : phase.competencies.filter((c) => c.tier === filter);
        return (
          <section key={phase.id} className={styles.phase}>
            <h2 className={styles.phaseTitle}>
              <code>{phase.id}</code> {phase.title}
            </h2>
            {shown.map((c) => (
              <div key={c.id} className={styles.competency}>
                <div className={styles.competencyHead}>
                  <strong>{c.title}</strong>
                  <TierBadge tier={c.tier} />
                </div>
                <dl className={styles.fields}>
                  <dt>id</dt>
                  <dd>
                    <code>{c.id}</code>
                  </dd>
                  <dt>proves</dt>
                  <dd>{c.proves.join(', ')}</dd>
                  <dt>artifact</dt>
                  <dd>
                    <code>{c.artifact}</code>
                  </dd>
                  <dt>testing</dt>
                  <dd>{c.testing}</dd>
                  <dt>mastered when</dt>
                  <dd>{c.masteredWhen}</dd>
                </dl>
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}
