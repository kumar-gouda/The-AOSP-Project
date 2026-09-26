import React, {useState} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

/**
 * Reusable unit-template components.
 *
 * These map 1:1 to the fields of the Learning Unit Template
 * (see the plan, §4.5 / §8.3). Content is data; this is presentation.
 * Adding a new phase means writing MDX that uses these tags — never new markup.
 */

export function Hook({children}) {
  return <div className={clsx(styles.block, styles.hook)}>{children}</div>;
}

export function Outcome({children}) {
  return (
    <div className={clsx(styles.block, styles.outcome)}>
      <strong>Outcome — </strong>
      {children}
    </div>
  );
}

export function Prereqs({items = [], interactive = false}) {
  const [checked, setChecked] = useState({});
  const allChecked =
    interactive && items.length > 0 && items.every((_, i) => checked[i]);

  const toggle = (i) => {
    setChecked((prev) => ({...prev, [i]: !prev[i]}));
  };

  return (
    <div className={clsx(styles.block, styles.prereqs)}>
      <strong>Prerequisites</strong>
      {interactive ? (
        <>
          <ul className={styles.prereqChecklist}>
            {items.map((item, i) => (
              <li key={i}>
                <label className={styles.prereqLabel}>
                  <input
                    type="checkbox"
                    checked={!!checked[i]}
                    onChange={() => toggle(i)}
                  />
                  <span className={checked[i] ? styles.prereqDone : ''}>
                    {item}
                  </span>
                </label>
              </li>
            ))}
          </ul>
          {allChecked && (
            <p className={styles.prereqAllDone}>
              ✅ All prerequisites met — ready to begin!
            </p>
          )}
        </>
      ) : (
        <ul>
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function DoThis({steps = []}) {
  return (
    <ol className={styles.steps}>
      {steps.map((step, i) => (
        <li key={i}>{step}</li>
      ))}
    </ol>
  );
}

export function WhyItWorked({children}) {
  return (
    <div className={clsx(styles.block, styles.why)}>
      <strong>Why it worked</strong>
      <div>{children}</div>
    </div>
  );
}

export function BreakIt({items = []}) {
  return (
    <div className={clsx(styles.block, styles.break)}>
      <strong>Break it</strong>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Checkpoint - an instant-feedback quick-check (plan §4.5), not graded.
 *
 * Supports two forms for backward compatibility:
 *   1. Interactive (preferred): <Checkpoint quiz={{question, options, answer, explain}} />
 *   2. Legacy static:           <Checkpoint question="...">answer text</Checkpoint>
 *
 * `quiz.answer` is the 0-based index of the correct option. Nothing here is
 * persisted or scored - it is a self-check, matching the plan's wording.
 */
export function Checkpoint({question, quiz, children}) {
  // Legacy/static form: no quiz object provided.
  if (!quiz) {
    return (
      <div className={clsx(styles.block, styles.checkpoint)}>
        <p className={styles.checkpointQuestion}>
          <strong>Checkpoint:</strong> {question}
        </p>
        <div className={styles.checkpointBody}>{children}</div>
      </div>
    );
  }

  return <Quiz {...quiz} />;
}

function Quiz({question, options = [], answer, explain}) {
  const [picked, setPicked] = useState(null);
  const answered = picked !== null;
  const correct = answered && picked === answer;

  return (
    <div className={clsx(styles.block, styles.checkpoint)}>
      <p className={styles.checkpointQuestion}>
        <strong>Checkpoint:</strong> {question}
      </p>
      <ul className={styles.quizOptions}>
        {options.map((opt, i) => {
          let stateClass = '';
          if (answered) {
            if (i === answer) stateClass = styles.quizCorrect;
            else if (i === picked) stateClass = styles.quizWrong;
          }
          return (
            <li key={i}>
              <button
                type="button"
                className={clsx(styles.quizOption, stateClass)}
                onClick={() => setPicked(i)}
                aria-pressed={picked === i}>
                {opt}
              </button>
            </li>
          );
        })}
      </ul>
      {answered ? (
        <div className={styles.checkpointBody}>
          <p
            className={clsx(
              styles.quizFeedback,
              correct ? styles.quizFeedbackOk : styles.quizFeedbackNo,
            )}>
            {correct ? 'Correct. ' : 'Not quite. '}
            {explain}
          </p>
          <button
            type="button"
            className={clsx(
              'button button--secondary button--sm',
              styles.quizRetry,
            )}
            onClick={() => setPicked(null)}>
            Try again
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function Reward({xp, badge}) {
  return (
    <div className={clsx(styles.block, styles.reward)}>
      <strong>Reward:</strong> +{xp} XP{badge ? ` · Badge: ${badge}` : ''}
    </div>
  );
}

export function NextMission({to, children}) {
  // Use Docusaurus Link: it does client-side navigation AND is validated by the
  // broken-link checker. A raw <a href> would do neither.
  return (
    <div className={clsx(styles.block, styles.next)}>
      <strong>Next mission — </strong>
      <Link to={to}>{children}</Link>
    </div>
  );
}

/* -----------------------------------------------------------------------
 * New components added for the platform upgrade.
 * All follow the same pattern: clsx + CSS modules, no external deps.
 * ----------------------------------------------------------------------- */

/** Displays estimated completion time as a styled pill badge. */
export function TimeEstimate({hours}) {
  return (
    <span className={styles.timeEstimate}>
      ⏱️ ~{hours} {hours === 1 ? 'hour' : 'hours'}
    </span>
  );
}

const DIFFICULTY_CONFIG = {
  beginner: {label: 'Beginner', emoji: '🟢'},
  intermediate: {label: 'Intermediate', emoji: '🟡'},
  advanced: {label: 'Advanced', emoji: '🔴'},
};

/** Displays a colored difficulty badge: beginner / intermediate / advanced. */
export function DifficultyBadge({level = 'intermediate'}) {
  const config = DIFFICULTY_CONFIG[level] || DIFFICULTY_CONFIG.intermediate;
  const cls = styles[`diff${config.label}`]; // diffBeginner | diffIntermediate | diffAdvanced
  return (
    <span className={clsx(styles.diffBadge, cls)}>
      {config.emoji} {config.label}
    </span>
  );
}

const STACK_LAYERS = [
  {id: 'app', label: 'App Layer'},
  {id: 'framework', label: 'Framework (SystemService)'},
  {id: 'hal', label: 'AIDL HAL + Binder'},
  {id: 'native', label: 'Native Daemons (Bionic)'},
  {id: 'kernel', label: 'Linux Kernel'},
];

/**
 * Renders a vertical "You Are Here" diagram of the 5-layer Android stack.
 * `highlight` accepts a single layer id string or an array of ids.
 * Valid ids: 'app', 'framework', 'hal', 'native', 'kernel'.
 */
export function ArchitectureDiagram({highlight = []}) {
  const highlights = Array.isArray(highlight) ? highlight : [highlight];
  return (
    <div className={styles.archDiagram} role="figure" aria-label="Android architecture stack">
      <p className={styles.archTitle}>
        <strong>Android Stack — You are here</strong>
      </p>
      {STACK_LAYERS.map((layer) => {
        const active = highlights.includes(layer.id);
        return (
          <div
            key={layer.id}
            className={clsx(styles.archLayer, active && styles.archLayerActive)}
            aria-current={active ? 'true' : undefined}
          >
            {active && <span className={styles.archArrow} aria-hidden="true">▶ </span>}
            {layer.label}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Collapsible troubleshooting table. Each item is {symptom, cause, fix}.
 * Uses native HTML <details> — no JS, accessible, works without hydration.
 */
export function Troubleshooting({items = []}) {
  if (items.length === 0) return null;
  return (
    <details className={clsx(styles.block, styles.troubleshooting)}>
      <summary className={styles.troubleshootingSummary}>
        <strong>🔧 Common problems</strong>
      </summary>
      <table className={styles.troubleshootingTable}>
        <thead>
          <tr>
            <th>Symptom</th>
            <th>Likely cause</th>
            <th>Fix</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td>{item.symptom}</td>
              <td>{item.cause}</td>
              <td>{item.fix}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}

/** Curated external reference links with optional descriptions. */
export function FurtherReading({links = []}) {
  if (links.length === 0) return null;
  return (
    <div className={clsx(styles.block, styles.furtherReading)}>
      <strong>📚 Further reading</strong>
      <ul className={styles.furtherReadingList}>
        {links.map((link, i) => (
          <li key={i}>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {link.title}
            </a>
            {link.desc && (
              <span className={styles.furtherReadingDesc}> — {link.desc}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
