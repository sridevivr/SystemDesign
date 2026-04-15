type Props = {
  xpAwarded: number;
  nextAction: 'home' | 'unit-review';
  onContinue: () => void;
};

export function LessonComplete({ xpAwarded, nextAction, onContinue }: Props) {
  return (
    <div className="rounded-2xl border-2 border-brand bg-brand/10 p-8 text-center space-y-4">
      <div className="text-5xl">🎉</div>
      <h2 className="text-2xl font-bold text-brand-dark">Lesson complete!</h2>
      <div className="text-lg font-semibold text-slate-700">+{xpAwarded} XP</div>
      {nextAction === 'unit-review' && (
        <p className="text-sm text-slate-600">
          You just finished the last lesson of this unit. Time for a quick
          review to tie everything together.
        </p>
      )}
      <button
        onClick={onContinue}
        className="w-full rounded-xl bg-brand text-white font-bold py-3 hover:bg-brand-dark"
      >
        {nextAction === 'unit-review' ? 'Start unit review' : 'Continue'}
      </button>
    </div>
  );
}
