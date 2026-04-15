import { Lightbulb } from 'lucide-react';
import type { Analogy } from '../content/types';
import { CardShell } from './CardShell';

type Props = {
  analogy: Analogy;
  onContinue: () => void;
};

export function AnalogyCard({ analogy, onContinue }: Props) {
  return (
    <CardShell
      footer={
        <button
          onClick={onContinue}
          className="w-full rounded-2xl bg-indigo-500 px-4 py-3 font-semibold text-white transition hover:bg-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          Continue
        </button>
      }
    >
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
        <Lightbulb className="h-3.5 w-3.5" />
        <span>Think of it like…</span>
      </div>
      <h2 className="mt-2 text-xl font-semibold text-slate-800 dark:text-slate-100">
        {analogy.title}
      </h2>
      <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-300">
        {analogy.body}
      </p>
    </CardShell>
  );
}
