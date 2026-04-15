import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

const STORAGE_KEY = 'sdq.welcome-dismissed';

function readDismissed(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return true;
  }
}

export function WelcomeCard() {
  const [dismissed, setDismissed] = useState<boolean>(readDismissed);

  if (dismissed) return null;

  const dismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore storage errors; hiding it for the session is still fine
    }
    setDismissed(true);
  };

  return (
    <div className="animate-fade-in relative rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:shadow-soft-dark">
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss welcome card"
        className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
      >
        <X size={16} />
      </button>

      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-300">
        <Sparkles className="h-3.5 w-3.5" />
        <span>Welcome</span>
      </div>
      <h2 className="mt-2 text-2xl font-semibold text-slate-800 dark:text-slate-100">
        System Design Quest
      </h2>
      <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-300">
        A gamified way to learn system design from the ground up. Every lesson
        starts with a plain-English definition, shows how a real company
        (Netflix, Instagram, Uber, Stripe…) actually uses the concept, ties it
        to an everyday analogy, and then quizzes you on it. No signup — your
        progress lives in this browser. Start with{' '}
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          Client and server
        </span>{' '}
        and work your way up.
      </p>

      <button
        type="button"
        onClick={dismiss}
        className="mt-5 w-full rounded-2xl bg-indigo-500 px-4 py-3 font-semibold text-white transition hover:bg-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 sm:w-auto sm:px-6"
      >
        Let's go
      </button>
    </div>
  );
}
