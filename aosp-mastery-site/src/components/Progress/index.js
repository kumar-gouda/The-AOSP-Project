import React, {useCallback, useEffect, useMemo, useState} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

/**
 * Client-side progress tracking (plan §8.5).
 *
 * - Offline-first: state lives in localStorage. No backend.
 * - JSON export/import from day one: the safety net against cleared storage.
 * - SSR-safe: Docusaurus renders on the server, where `localStorage` does not
 *   exist. Every access is guarded and deferred until after mount.
 *
 * Storage shape:
 *   { "version": 1, "xp": number, "completed": { "<unitId>": true } }
 */

const STORAGE_KEY = 'aosp-mastery:progress:v1';

const EMPTY_STATE = {version: 1, xp: 0, completed: {}};

function readState() {
  if (typeof window === 'undefined') return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw);
    // Defensive: never trust stored shape.
    return {
      version: 1,
      xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
      completed:
        parsed.completed && typeof parsed.completed === 'object'
          ? parsed.completed
          : {},
    };
  } catch {
    return EMPTY_STATE;
  }
}

function writeState(state) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage full or blocked — fail silently, keep UI working */
  }
}

export function useProgress() {
  // Start empty on the server and on first client render to avoid hydration
  // mismatch, then load real state after mount.
  const [state, setState] = useState(EMPTY_STATE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setState(readState());
    setMounted(true);
  }, []);

  const persist = useCallback((next) => {
    setState(next);
    writeState(next);
  }, []);

  const completeUnit = useCallback(
    (unitId, xp = 40) => {
      setState((prev) => {
        if (prev.completed[unitId]) return prev;
        const next = {
          ...prev,
          xp: prev.xp + xp,
          completed: {...prev.completed, [unitId]: true},
        };
        writeState(next);
        return next;
      });
    },
    [],
  );

  const reset = useCallback(() => persist(EMPTY_STATE), [persist]);

  const exportJson = useCallback(() => JSON.stringify(state, null, 2), [state]);

  const importJson = useCallback(
    (text) => {
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Not a progress object.');
      }
      const next = {
        version: 1,
        xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
        completed:
          parsed.completed && typeof parsed.completed === 'object'
            ? parsed.completed
            : {},
      };
      persist(next);
      return next;
    },
    [persist],
  );

  return {state, mounted, completeUnit, reset, exportJson, importJson};
}

/** A button that marks a unit complete and awards XP. */
export function CompleteButton({unitId, xp = 40, label = 'Mark unit complete'}) {
  const {state, mounted, completeUnit} = useProgress();
  const done = mounted && !!state.completed[unitId];
  return (
    <button
      type="button"
      className={clsx('button button--primary', styles.completeButton)}
      disabled={done || !mounted}
      onClick={() => completeUnit(unitId, xp)}>
      {done ? 'Completed' : label}
    </button>
  );
}

/** A compact progress panel: XP, count, export/import/reset. */
export function ProgressPanel() {
  const {state, mounted, reset, exportJson, importJson} = useProgress();
  const [message, setMessage] = useState('');
  const count = useMemo(
    () => Object.keys(state.completed).length,
    [state.completed],
  );

  const onExport = () => {
    const blob = new Blob([exportJson()], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aosp-mastery-progress.json';
    a.click();
    URL.revokeObjectURL(url);
    setMessage('Exported aosp-mastery-progress.json');
  };

  const onImport = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importJson(String(reader.result));
        setMessage('Progress imported.');
      } catch (err) {
        setMessage(`Import failed: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className={clsx(styles.panel)}>
      <div className={styles.stats}>
        <span className={styles.stat}>
          <strong>{mounted ? state.xp : '—'}</strong> XP
        </span>
        <span className={styles.stat}>
          <strong>{mounted ? count : '—'}</strong> units complete
        </span>
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className="button button--secondary button--sm"
          onClick={onExport}
          disabled={!mounted}>
          Export JSON
        </button>
        <label className="button button--secondary button--sm">
          Import JSON
          <input
            type="file"
            accept="application/json,.json"
            onChange={onImport}
            hidden
          />
        </label>
        <button
          type="button"
          className="button button--secondary button--sm"
          onClick={() => {
            reset();
            setMessage('Progress reset.');
          }}
          disabled={!mounted}>
          Reset
        </button>
      </div>
      {message ? <p className={styles.message}>{message}</p> : null}
    </div>
  );
}
