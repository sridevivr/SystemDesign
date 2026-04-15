import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';

type Props = {
  unitTitle: string;
  xpAwarded: number;
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

export function UnitComplete({ unitTitle, xpAwarded, onContinue }: Props) {
  const displayXp = useCountUp(xpAwarded);

  return (
    <div className="animate-fade-in flex flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:shadow-soft-dark">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-amber-400/30 dark:bg-amber-400/20 animate-pulse-ring"
        />
        <Trophy className="relative h-12 w-12 text-amber-500 dark:text-amber-400" />
      </div>
      <div className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
        Unit mastered
      </div>
      <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
        {unitTitle}
      </h2>
      <div className="text-4xl font-semibold text-amber-500 dark:text-amber-400">
        +{displayXp} XP
      </div>
      <button
        onClick={onContinue}
        className="mt-2 w-full rounded-2xl bg-indigo-500 px-4 py-3 font-semibold text-white transition hover:bg-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400"
      >
        Continue
      </button>
    </div>
  );
}
