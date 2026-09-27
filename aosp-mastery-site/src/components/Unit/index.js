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

/* -----------------------------------------------------------------------
 * Educational helper components for beginner demystification.
 * ----------------------------------------------------------------------- */

/**
 * Breaks down unfamiliar keywords, abbreviations, and acronyms with full
 * names, plain-English definitions, and practical AOSP context.
 */
export function KeywordSpotlight({terms = []}) {
  if (terms.length === 0) return null;
  return (
    <div className={styles.keywordSpotlight}>
      <div className={styles.spotlightHeader}>
        <span className={styles.spotlightIcon}>💡</span>
        <h4 className={styles.spotlightTitle}>Keywords & Acronyms Demystified</h4>
      </div>
      <div className={styles.spotlightGrid}>
        {terms.map((t, i) => (
          <div key={i} className={styles.spotlightCard}>
            <div className={styles.spotlightCardTop}>
              <code className={styles.spotlightTerm}>{t.term}</code>
              {t.full && <span className={styles.spotlightFull}>{t.full}</span>}
            </div>
            <p className={styles.spotlightMeaning}>{t.meaning}</p>
            {t.context && (
              <p className={styles.spotlightContext}>
                <strong>Why it matters:</strong> {t.context}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Expandable deep-dive block for complex, tricky, or under-the-hood
 * mechanics (memory layouts, CPU registers, kernel subsystems).
 */
export function DeepDive({title, icon = '🔬', defaultOpen = true, children}) {
  return (
    <details className={styles.deepDive} open={defaultOpen}>
      <summary className={styles.deepDiveSummary}>
        <span className={styles.deepDiveIcon}>{icon}</span>
        <strong>Deep Dive: {title}</strong>
      </summary>
      <div className={styles.deepDiveContent}>{children}</div>
    </details>
  );
}

/**
 * Line-by-line syntax annotation box for demystifying tricky C++/C language
 * keywords and macros (explicit, noexcept, container_of, volatile, etc.).
 */
export function CodeAnnotator({title = 'Syntax Breakdown', items = []}) {
  if (items.length === 0) return null;
  return (
    <div className={styles.annotatorBox}>
      <h5 className={styles.annotatorTitle}>
        <span className={styles.annotatorIcon}>🔎</span> {title}
      </h5>
      <dl className={styles.annotatorList}>
        {items.map((item, i) => (
          <div key={i} className={styles.annotatorItem}>
            <dt className={styles.annotatorTerm}>
              <code>{item.syntax}</code>
            </dt>
            <dd className={styles.annotatorDesc}>
              <strong>{item.purpose}:</strong> {item.explanation}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/**
 * Side-by-side comparison table to eliminate common confusions
 * between closely related concepts.
 */
export function ConceptComparison({
  title,
  leftHeader = 'Concept A',
  rightHeader = 'Concept B',
  rows = [],
}) {
  if (rows.length === 0) return null;
  return (
    <div className={styles.comparisonWrapper}>
      {title && <h5 className={styles.comparisonTitle}>⚖️ {title}</h5>}
      <table className={styles.comparisonTable}>
        <thead>
          <tr>
            <th className={styles.compFeatureCol}>Feature / Dimension</th>
            <th className={styles.compHeaderCol}>{leftHeader}</th>
            <th className={styles.compHeaderCol}>{rightHeader}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className={styles.compFeatureCell}>{r.feature}</td>
              <td>{r.left}</td>
              <td>{r.right}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * DidYouKnow component: Industry trivia, Android architecture origins, and fascinating facts.
 */
export function DidYouKnow({title = 'Did You Know?', children}) {
  return (
    <div className={styles.didYouKnow}>
      <div className={styles.didYouKnowHeader}>
        <span className={styles.didYouKnowIcon}>💡</span>
        <strong className={styles.didYouKnowTitle}>{title}</strong>
      </div>
      <div className={styles.didYouKnowBody}>{children}</div>
    </div>
  );
}

/**
 * DevGotcha component: Real-world struggle zones, developer traps, and QA pitfalls.
 */
export function DevGotcha({title = 'Developer & Tester Struggle Zone', traps = []}) {
  if (!traps || traps.length === 0) return null;
  return (
    <div className={styles.devGotcha}>
      <div className={styles.devGotchaHeader}>
        <span className={styles.devGotchaIcon}>⚠️</span>
        <strong className={styles.devGotchaTitle}>{title}</strong>
      </div>
      <div className={styles.devGotchaList}>
        {traps.map((t, i) => (
          <div key={i} className={styles.devGotchaItem}>
            <div className={styles.devGotchaTrap}>
              <span className={styles.gotchaNum}>#{i + 1}</span> {t.trap}
            </div>
            {t.symptom && (
              <p className={styles.gotchaRow}>
                <strong className={styles.gotchaLabelRed}>Symptom:</strong> {t.symptom}
              </p>
            )}
            {t.why && (
              <p className={styles.gotchaRow}>
                <strong className={styles.gotchaLabelOrange}>Why it happens:</strong> {t.why}
              </p>
            )}
            {t.fix && (
              <p className={styles.gotchaRow}>
                <strong className={styles.gotchaLabelGreen}>The Fix:</strong> {t.fix}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * TrialErrorLab component: Guided failure drills where learners intentionally break things
 * to understand the exact crash symptom and how to diagnose it.
 */
export function TrialErrorLab({title, goal, experiment, expectedError, diagnosis, fix}) {
  return (
    <div className={styles.trialLab}>
      <div className={styles.trialLabHeader}>
        <span className={styles.trialLabIcon}>🔬</span>
        <strong>Trial &amp; Error Lab: {title}</strong>
      </div>
      <div className={styles.trialLabBody}>
        {goal && <p className={styles.trialGoal}><strong>🎯 Goal:</strong> {goal}</p>}
        {experiment && (
          <div className={styles.trialSection}>
            <strong className={styles.trialStepTitle}>1. The Broken Experiment (Do this on purpose):</strong>
            <div className={styles.trialCode}>{experiment}</div>
          </div>
        )}
        {expectedError && (
          <div className={styles.trialSection}>
            <strong className={styles.trialStepTitle}>2. What will happen (Expected Failure Output):</strong>
            <div className={styles.trialErrorBox}>{expectedError}</div>
          </div>
        )}
        {diagnosis && (
          <div className={styles.trialSection}>
            <strong className={styles.trialStepTitle}>3. How to Diagnose It:</strong>
            <div className={styles.trialDiagnosis}>{diagnosis}</div>
          </div>
        )}
        {fix && (
          <div className={styles.trialSection}>
            <strong className={styles.trialStepTitle}>4. The Fix:</strong>
            <div className={styles.trialFix}>{fix}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * DebugToolkit component: Tabbed interactive debugging cheat-sheet.
 */
export function DebugToolkit({title = 'Debugging Arsenal & How-Tos', tools = []}) {
  const [activeTab, setActiveTab] = useState(0);
  if (!tools || tools.length === 0) return null;

  return (
    <div className={styles.debugToolkit}>
      <div className={styles.debugHeader}>
        <span className={styles.debugIcon}>🛠️</span>
        <strong className={styles.debugTitle}>{title}</strong>
      </div>
      <div className={styles.debugTabs}>
        {tools.map((tool, idx) => (
          <button
            key={idx}
            type="button"
            className={clsx(styles.debugTab, activeTab === idx && styles.debugTabActive)}
            onClick={() => setActiveTab(idx)}>
            {tool.name}
          </button>
        ))}
      </div>
      <div className={styles.debugContent}>
        {tools[activeTab] && (
          <div>
            <div className={styles.debugDesc}>
              <strong>Purpose:</strong> {tools[activeTab].purpose}
            </div>
            {tools[activeTab].command && (
              <div className={styles.debugCmdBox}>
                <span className={styles.debugCmdLabel}>Command:</span>
                <code>{tools[activeTab].command}</code>
              </div>
            )}
            {tools[activeTab].tip && (
              <div className={styles.debugTip}>
                <strong>💡 Pro-Tip:</strong> {tools[activeTab].tip}
              </div>
            )}
            {tools[activeTab].sampleOutput && (
              <details className={styles.debugOutputDetails}>
                <summary>View Sample Diagnostic Output</summary>
                <pre className={styles.debugPre}>{tools[activeTab].sampleOutput}</pre>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * VocabularyHelper component: Inline tooltip component demystifying difficult words for non-native speakers.
 */
export function VocabularyHelper({word, simple, analogy}) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <span
      className={styles.vocabWrapper}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip((s) => !s)}>
      <span className={styles.vocabWord}>{word}</span>
      <span className={styles.vocabBadge}>?</span>
      {showTooltip && (
        <span className={styles.vocabTooltip}>
          <span className={styles.vocabSimple}><strong>Simple Meaning:</strong> {simple}</span>
          {analogy && (
            <span className={styles.vocabAnalogy}><strong>Real-World Analogy:</strong> {analogy}</span>
          )}
        </span>
      )}
    </span>
  );
}


