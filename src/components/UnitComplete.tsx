type Props = {
  unitTitle: string;
  xpAwarded: number;
  onContinue: () => void;
};

export function UnitComplete({ unitTitle, xpAwarded, onContinue }: Props) {
  return (
    <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-8 text-center space-y-4">
      <div className="text-5xl">🏆</div>
      <h2 className="text-2xl font-bold text-amber-700">
        {unitTitle} complete!
      </h2>
      <div className="text-lg font-semibold text-slate-700">+{xpAwarded} XP</div>
      <button
        onClick={onContinue}
        className="w-full rounded-xl bg-amber-500 text-white font-bold py-3 hover:bg-amber-600"
      >
        Continue
      </button>
    </div>
  );
}
