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
          className="w-full rounded-xl bg-brand text-white font-bold py-3 hover:bg-brand-dark"
        >
          Continue
        </button>
      }
    >
      <div className="text-xs uppercase tracking-wider text-brand-dark font-bold">
        How {example.company} uses this →
      </div>
      <h2 className="text-xl font-bold text-slate-800 mt-1">{example.company}</h2>
      <p className="mt-3 text-slate-700 leading-relaxed">{example.scenario}</p>
    </CardShell>
  );
}
