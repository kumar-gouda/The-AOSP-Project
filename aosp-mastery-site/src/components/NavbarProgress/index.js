import React, {useMemo} from 'react';
import Link from '@docusaurus/Link';
import {useProgress} from '@site/src/components/Progress';
import styles from './styles.module.css';

const TOTAL_PHASES = 18;

export default function NavbarProgress() {
  const {state, mounted} = useProgress();

  const count = useMemo(() => {
    if (!mounted || !state.completed) return 0;
    return Object.keys(state.completed).length;
  }, [state.completed, mounted]);

  const xp = mounted ? state.xp : 0;

  return (
    <div className={styles.container}>
      <Link to="/roadmap" className={styles.badge} title="View Curriculum Roadmap">
        <span className={styles.trophy}>🏆</span>
        <span className={styles.xpText}>{xp} XP</span>
        <span className={styles.divider}>·</span>
        <span className={styles.countText}>{count}/{TOTAL_PHASES}</span>
      </Link>
    </div>
  );
}
