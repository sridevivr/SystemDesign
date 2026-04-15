import { Building2 } from 'lucide-react';
import type { RealWorldExample } from '../content/types';
import { CardShell } from './CardShell';

type Props = {
  example: RealWorldExample;
  onContinue: () => void;
};

export function ExampleCard({ example, onContinue }: Props) {
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
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-300">
        <span>How</span>
        <Building2 className="h-3.5 w-3.5" />
        <span>{example.company} uses this</span>
      </div>
      <h2 className="mt-2 text-xl font-semibold text-slate-800 dark:text-slate-100">
        {example.company}
      </h2>
      <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-300">
        {example.scenario}
      </p>
    </CardShell>
  );
}
