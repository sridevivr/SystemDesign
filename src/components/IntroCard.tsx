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
          className="w-full rounded-xl bg-brand text-white font-bold py-3 hover:bg-brand-dark"
        >
          Let's go
        </button>
      }
    >
      <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">
        New concept
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mt-1">{title}</h2>
      <p className="mt-3 text-slate-700 leading-relaxed">{intro}</p>
    </CardShell>
  );
}
