import { useEffect, useRef, useState } from 'react';
import {
  LayoutGrid,
  Zap,
  Sun,
  Moon,
  Monitor,
  Settings,
  RotateCcw,
} from 'lucide-react';
import { useProgress, type Theme } from '../store/progress';
import { curriculum } from '../content';
import { flattenLessons } from '../lib/progression';

const TOTAL_LESSONS = flattenLessons(curriculum).length;

const NEXT_THEME: Record<Theme, Theme> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
};

const NEXT_THEME_LABEL: Record<Theme, string> = {
  system: 'Switch to light theme',
  light: 'Switch to dark theme',
  dark: 'Switch to system theme',
};

export function Header() {
  const xp = useProgress((s) => s.xp);
  const completed = useProgress((s) => s.completed);
  const theme = useProgress((s) => s.theme);
  const setTheme = useProgress((s) => s.setTheme);
  const reset = useProgress((s) => s.reset);

  const lessonsDone = completed.length;
  const pct =
    TOTAL_LESSONS === 0
      ? 0
      : Math.min(100, Math.round((lessonsDone / TOTAL_LESSONS) * 100));

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 px-4">
        {/* Left: brand */}
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-500 text-white shadow-sm">
            <LayoutGrid size={16} />
          </span>
          <span className="text-base font-semibold text-slate-800 dark:text-slate-100">
            System Design Quest
          </span>
        </div>

        {/* Middle: progress breadcrumb */}
        <div className="hidden flex-1 items-center justify-center gap-3 sm:flex">
          <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
            {lessonsDone} / {TOTAL_LESSONS} lessons
          </span>
          <div
            className="h-1 w-[120px] overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
            aria-hidden="true"
          >
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Right: XP pill + theme + settings */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
            <Zap size={14} className="-ml-0.5" />
            <span className="font-mono">{xp}</span>
            <span className="opacity-70">XP</span>
          </span>

          <button
            type="button"
            onClick={() => setTheme(NEXT_THEME[theme])}
            aria-label={NEXT_THEME_LABEL[theme]}
            title={NEXT_THEME_LABEL[theme]}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <ThemeIcon size={16} />
          </button>

          <SettingsMenu onReset={reset} />
        </div>
      </div>
    </header>
  );
}

function SettingsMenu({ onReset }: { onReset: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [open]);

  const handleReset = () => {
    setOpen(false);
    if (confirm('Reset all progress? This cannot be undone.')) onReset();
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open settings menu"
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
      >
        <Settings size={16} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-1 w-44 origin-top-right animate-fade-in rounded-lg border border-slate-200 bg-white py-1 shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:shadow-soft-dark"
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleReset}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            <RotateCcw size={14} />
            Reset progress
          </button>
        </div>
      )}
    </div>
  );
}
