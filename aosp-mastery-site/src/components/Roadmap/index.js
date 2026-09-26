import React, {useMemo} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useProgress} from '@site/src/components/Progress';
import styles from './styles.module.css';

export const ROADMAP_PHASES = [
  {
    id: 'phase-minus-1-foundation',
    num: 'Phase -1',
    title: 'Foundation',
    subtitle: 'C++17 for userspace & Systems-C for kernel',
    tier: 'Builder',
    hours: 6,
    difficulty: 'Intermediate',
    artifact: 'spine/00-cpp17-lib & spine/00-abi-probe',
    link: '/docs/phase-minus-1-foundation',
    xp: 500,
  },
  {
    id: 'phase-0-basecamp',
    num: 'Phase 0',
    title: 'Basecamp',
    subtitle: 'Hardware gate, modern repo, Cuttlefish KVM setup',
    tier: 'Recruit',
    hours: 3,
    difficulty: 'Beginner',
    artifact: 'spine/00-cli',
    link: '/docs/phase-0-basecamp',
    xp: 500,
  },
  {
    id: 'phase-1-systems',
    num: 'Phase 1',
    title: 'Systems Foundations',
    subtitle: 'Virtual memory, IPC (pipes, shm, signals), strace on ARM64',
    tier: 'Builder',
    hours: 5,
    difficulty: 'Intermediate',
    artifact: 'spine/01-ipc',
    link: '/docs/phase-1-systems',
    xp: 500,
  },
  {
    id: 'phase-2-build-system',
    num: 'Phase 2',
    title: 'Build System',
    subtitle: 'Soong (Android.bp), Kati, lunch targets, incremental compilation',
    tier: 'Builder',
    hours: 8,
    difficulty: 'Intermediate',
    artifact: 'spine/02-instrumentation',
    link: '/docs/phase-2-build-system',
    xp: 500,
  },
  {
    id: 'phase-3-boot-init',
    num: 'Phase 3',
    title: 'Boot & Init',
    subtitle: 'First-stage/second-stage init (PID 1), init.rc, logcat vs dmesg',
    tier: 'Builder',
    hours: 4,
    difficulty: 'Intermediate',
    artifact: 'spine/03-init-service',
    link: '/docs/phase-3-boot-init',
    xp: 500,
  },
  {
    id: 'phase-4-kernel-foundations',
    num: 'Phase 4',
    title: 'Kernel Foundations',
    subtitle: 'ACK, GKI, KMI, building kernel with Kleaf/Bazel',
    tier: 'Engineer',
    hours: 6,
    difficulty: 'Advanced',
    artifact: 'spine/04-gki',
    link: '/docs/phase-4-kernel-foundations',
    xp: 500,
  },
  {
    id: 'phase-5-native-runtime',
    num: 'Phase 5',
    title: 'Native Userspace & Runtime',
    subtitle: 'Bionic C library, NDK daemon, ART, Zygote fork model, atest',
    tier: 'Engineer',
    hours: 5,
    difficulty: 'Intermediate',
    artifact: 'spine/05-ndk-daemon',
    link: '/docs/phase-5-native-runtime',
    xp: 500,
  },
  {
    id: 'phase-6-hal-binder',
    num: 'Phase 6',
    title: 'HAL, Treble & Binder',
    subtitle: 'AIDL HAL, @VintfStability, servicemanager, Vendor Test Suite (VTS)',
    tier: 'Engineer',
    hours: 6,
    difficulty: 'Advanced',
    artifact: 'spine/06-aidl-hal',
    link: '/docs/phase-6-hal-binder',
    xp: 500,
  },
  {
    id: 'phase-7-framework-layer',
    num: 'Phase 7',
    title: 'Framework Layer',
    subtitle: 'SystemService in system_server, AIDL IPC, permission enforcement',
    tier: 'Engineer',
    hours: 5,
    difficulty: 'Intermediate',
    artifact: 'spine/07-systemservice',
    link: '/docs/phase-7-framework-layer',
    xp: 500,
  },
  {
    id: 'phase-8-security-model',
    num: 'Phase 8',
    title: 'Security Model',
    subtitle: 'SELinux policy (.te files), avc denials, CTS security host tests',
    tier: 'Engineer',
    hours: 5,
    difficulty: 'Advanced',
    artifact: 'spine/08-selinux',
    link: '/docs/phase-8-security-model',
    xp: 500,
  },
  {
    id: 'phase-9-debugging-performance',
    num: 'Phase 9',
    title: 'Debugging & Performance',
    subtitle: 'Crash tombstones, ndk-stack, Perfetto system tracing, ftrace',
    tier: 'Engineer',
    hours: 4,
    difficulty: 'Intermediate',
    artifact: 'spine/09-seeded-bug',
    link: '/docs/phase-9-debugging-performance',
    xp: 500,
  },
  {
    id: 'phase-10-kernel-mastery',
    num: 'Phase 10',
    title: 'Kernel Mastery',
    subtitle: 'Loadable kernel modules (.ko), /proc seq_file, Kleaf build, insmod',
    tier: 'Architect',
    hours: 6,
    difficulty: 'Advanced',
    artifact: 'spine/10-kmod',
    link: '/docs/phase-10-kernel-mastery',
    xp: 500,
  },
  {
    id: 'phase-10-5-drivers',
    num: 'Phase 10.5',
    title: 'Kernel Subsystems & Drivers',
    subtitle: 'Char/IIO devices, Device Tree (.dts), probe() callbacks, KUnit',
    tier: 'Architect',
    hours: 8,
    difficulty: 'Advanced',
    artifact: 'spine/10.5-driver',
    link: '/docs/phase-10-5-drivers',
    xp: 500,
  },
  {
    id: 'phase-11-real-device',
    num: 'Phase 11',
    title: 'Real Device Fundamentals',
    subtitle: 'Partition layout (super.img, vbmeta), A/B slots, fastboot unlock',
    tier: 'Architect',
    hours: 3,
    difficulty: 'Intermediate',
    artifact: 'spine/11-image-analysis',
    link: '/docs/phase-11-real-device',
    xp: 500,
  },
  {
    id: 'phase-12-pixel-bringup',
    num: 'Phase 12',
    title: 'Pixel Bring-Up Workshop',
    subtitle: '[Elective] Physical Pixel flashing, vendor blobs extraction, brick prevention',
    tier: 'Master',
    hours: 10,
    difficulty: 'Advanced',
    artifact: 'spine/12-pixel',
    link: '/docs/phase-12-pixel-bringup',
    xp: 500,
  },
  {
    id: 'phase-13-production-readiness',
    num: 'Phase 13',
    title: 'Production Readiness Extras',
    subtitle: 'Rust in AOSP, APEX containers, SurfaceFlinger/Camera HAL, Tradefed',
    tier: 'Architect',
    hours: 6,
    difficulty: 'Advanced',
    artifact: 'spine/13-hardening',
    link: '/docs/phase-13-production-readiness',
    xp: 500,
  },
  {
    id: 'phase-14-contribution',
    num: 'Phase 14',
    title: 'Contribution Workflow',
    subtitle: 'Upstream Gerrit workflow, commit-msg hooks, repo upload etiquette',
    tier: 'Architect',
    hours: 3,
    difficulty: 'Intermediate',
    artifact: 'spine/14-patch-series',
    link: '/docs/phase-14-contribution',
    xp: 500,
  },
  {
    id: 'phase-15-capstone',
    num: 'Phase 15',
    title: 'Capstone: Full-Stack Spine',
    subtitle: 'Vertical slice integration, passing CTS/VTS subset, reviewer-graded fork',
    tier: 'Architect',
    hours: 20,
    difficulty: 'Advanced',
    artifact: 'spine/15-full',
    link: '/docs/phase-15-capstone',
    xp: 2000,
  },
];

const TIER_CLASSES = {
  Recruit: styles.tierRecruit,
  Builder: styles.tierBuilder,
  Engineer: styles.tierEngineer,
  Architect: styles.tierArchitect,
  Master: styles.tierMaster,
};

export default function Roadmap() {
  const {state, mounted} = useProgress();

  const completedCount = useMemo(() => {
    if (!mounted) return 0;
    return ROADMAP_PHASES.filter((p) => !!state.completed[p.id]).length;
  }, [state.completed, mounted]);

  const totalXP = 10500;
  const currentXP = mounted ? state.xp : 0;
  const percentComplete = Math.min(100, Math.round((completedCount / ROADMAP_PHASES.length) * 100));

  return (
    <div className={styles.roadmapWrapper}>
      <header className={styles.overviewBar}>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Curriculum Progress</span>
          <span className={styles.metricValue}>
            {completedCount} <span className={styles.metricSub}>/ {ROADMAP_PHASES.length} phases</span>
          </span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Total Experience</span>
          <span className={styles.metricValue}>
            {currentXP.toLocaleString()} <span className={styles.metricSub}>/ {totalXP.toLocaleString()} XP</span>
          </span>
        </div>
        <div className={styles.progressContainer}>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressBar}
              style={{width: `${percentComplete}%`}}
              role="progressbar"
              aria-valuenow={percentComplete}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
          <span className={styles.progressPercent}>{percentComplete}% completed</span>
        </div>
      </header>

      <div className={styles.timeline}>
        {ROADMAP_PHASES.map((phase, idx) => {
          const isDone = mounted && !!state.completed[phase.id];
          return (
            <div
              key={phase.id}
              className={clsx(styles.nodeCard, isDone && styles.nodeCardCompleted)}
            >
              <div className={styles.railCol}>
                <div className={clsx(styles.circleMarker, isDone && styles.circleCompleted)}>
                  {isDone ? '✓' : idx + 1}
                </div>
                {idx < ROADMAP_PHASES.length - 1 && <div className={styles.connectorLine} />}
              </div>

              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <div className={styles.titleRow}>
                    <span className={styles.phaseNum}>{phase.num}</span>
                    <h3 className={styles.phaseTitle}>{phase.title}</h3>
                  </div>
                  <div className={styles.badgeRow}>
                    <span className={clsx(styles.tierPill, TIER_CLASSES[phase.tier])}>
                      {phase.tier}
                    </span>
                    <span className={styles.timePill}>⏱️ ~{phase.hours}h</span>
                    <span className={styles.xpPill}>+{phase.xp} XP</span>
                  </div>
                </div>

                <p className={styles.subtitle}>{phase.subtitle}</p>

                <div className={styles.metaRow}>
                  <span className={styles.artifactLabel}>
                    Artifact: <code>{phase.artifact}</code>
                  </span>
                  <Link
                    to={phase.link}
                    className={clsx('button button--sm', isDone ? 'button--outline button--secondary' : 'button--primary')}
                  >
                    {isDone ? 'Review Phase' : 'Start Mission →'}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
