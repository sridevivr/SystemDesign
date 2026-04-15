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
          className="w-full rounded-xl bg-brand text-white font-bold py-3 hover:bg-brand-dark"
        >
          Continue
        </button>
      }
    >
      <div className="text-xs uppercase tracking-wider text-amber-600 font-bold">
        Think of it like…
      </div>
      <h2 className="text-xl font-bold text-slate-800 mt-1">{analogy.title}</h2>
      <p className="mt-3 text-slate-700 leading-relaxed">{analogy.body}</p>
    </CardShell>
  );
}
