import React, {useState} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

/**
 * TestRunner (plan section 8.3 - "RunnableTab").
 *
 * Contract from the plan: TestRunner = ({cmd, expect}) => <RunnableTab/>.
 *
 * HONESTY RULE: a browser cannot execute gcc, atest, kselftest, or AOSP
 * builds. So this component NEVER claims to run native commands. It shows:
 *   - Command tab: the exact command, with a Copy button.
 *   - Expected output tab: what a correct run produces.
 *
 * For the rare case of a purely browser-runnable snippet (plain JavaScript),
 * pass `runnableJs`. Only then is a real "Run" button offered, and it executes
 * in a sandboxed try/catch with captured console output. If `runnableJs` is
 * absent, no Run button is shown and nothing is faked.
 */
export function TestRunner({
  cmd,
  expect,
  title = 'Test',
  runnableJs,
  lang = 'bash',
}) {
  const [tab, setTab] = useState('cmd');
  const [copied, setCopied] = useState(false);
  const [runOutput, setRunOutput] = useState(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const runJs = () => {
    const lines = [];
    const fakeConsole = {
      log: (...a) => lines.push(a.join(' ')),
      error: (...a) => lines.push('ERROR: ' + a.join(' ')),
    };
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function('console', runnableJs);
      const result = fn(fakeConsole);
      if (result !== undefined) lines.push(String(result));
      setRunOutput(lines.join('\n') || '(no output)');
    } catch (err) {
      setRunOutput('Error: ' + err.message);
    }
  };

  return (
    <div className={styles.runner}>
      <div className={styles.tabs}>
        <button
          type="button"
          className={clsx(styles.tab, tab === 'cmd' && styles.tabActive)}
          onClick={() => setTab('cmd')}>
          Command
        </button>
        <button
          type="button"
          className={clsx(styles.tab, tab === 'out' && styles.tabActive)}
          onClick={() => setTab('out')}>
          Expected output
        </button>
      </div>

      {tab === 'cmd' ? (
        <div className={styles.pane}>
          <div className={styles.head}>
            <span className={styles.title}>{title}</span>
            <button
              type="button"
              className="button button--secondary button--sm"
              onClick={copy}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className={styles.pre}>
            <code>{cmd}</code>
          </pre>
          {runnableJs ? (
            <div className={styles.runRow}>
              <button
                type="button"
                className="button button--primary button--sm"
                onClick={runJs}>
                Run (JavaScript)
              </button>
              <span className={styles.runNote}>
                Runs in your browser - safe, sandboxed snippets only.
              </span>
            </div>
          ) : (
            <p className={styles.note}>
              Native command ({lang}). Run it on your machine; this page does not
              execute it.
            </p>
          )}
        </div>
      ) : (
        <div className={styles.pane}>
          <pre className={styles.pre}>
            <code>{expect}</code>
          </pre>
        </div>
      )}

      {runOutput !== null ? (
        <div className={styles.pane}>
          <div className={styles.head}>
            <span className={styles.title}>Your run output</span>
          </div>
          <pre className={styles.pre}>
            <code>{runOutput}</code>
          </pre>
        </div>
      ) : null}
    </div>
  );
}
