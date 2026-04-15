import { Sparkles } from 'lucide-react';
import { CardShell } from './CardShell';

type Props = {
  title: string;
  intro: string;
  onContinue: () => void;
};

export function IntroCard({ title, intro, onContinue }: Props) {
  return (
    <CardShell
      footer={
        <button
          onClick={onContinue}
          className="w-full rounded-2xl bg-indigo-500 px-4 py-3 font-semibold text-white transition hover:bg-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          Let's go
        </button>
      }
    >
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-300">
        <Sparkles className="h-3.5 w-3.5" />
        <span>New concept</span>
      </div>
      <h2 className="mt-2 text-2xl font-semibold text-slate-800 dark:text-slate-100">
        {title}
      </h2>
      <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-300">
        {intro}
      </p>
    </CardShell>
  );
}
