type Props = {
  xpAwarded: number;
  onContinue: () => void;
};

export function LessonComplete({ xpAwarded, onContinue }: Props) {
  return (
    <div className="rounded-2xl border-2 border-brand bg-brand/10 p-8 text-center space-y-4">
      <div className="text-5xl">🎉</div>
      <h2 className="text-2xl font-bold text-brand-dark">Lesson complete!</h2>
      <div className="text-lg font-semibold text-slate-700">+{xpAwarded} XP</div>
      <button
        onClick={onContinue}
        className="w-full rounded-xl bg-brand text-white font-bold py-3 hover:bg-brand-dark"
      >
        Continue
      </button>
    </div>
  );
}
