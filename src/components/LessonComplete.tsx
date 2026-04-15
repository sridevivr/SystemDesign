import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

type Props = {
  xpAwarded: number;
  nextAction: 'home' | 'unit-review';
  onContinue: () => void;
};

function useCountUp(target: number, durationMs = 600) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return value;
}

export function LessonComplete({ xpAwarded, nextAction, onContinue }: Props) {
  const displayXp = useCountUp(xpAwarded);

  return (
    <div className="animate-fade-in flex flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:shadow-soft-dark">
      <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
        Lesson complete
      </div>
      <h2 className="text-3xl font-semibold text-slate-800 dark:text-slate-100">
        Nicely done.
      </h2>
      <div className="flex items-center gap-2 text-4xl font-semibold text-amber-500 dark:text-amber-400">
        <Zap className="h-8 w-8" />
        <span>+{displayXp} XP</span>
      </div>
      {nextAction === 'unit-review' && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Time to tie it all together with a quick unit review.
        </p>
      )}
      <button
        onClick={onContinue}
        className="mt-2 w-full rounded-2xl bg-indigo-500 px-4 py-3 font-semibold text-white transition hover:bg-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400"
      >
        {nextAction === 'unit-review' ? 'Start unit review' : 'Continue'}
      </button>
    </div>
  );
}
