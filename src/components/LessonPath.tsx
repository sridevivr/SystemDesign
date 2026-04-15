import { curriculum } from '../content';
import {
  lessonStatus,
  nextLessonId,
  unitReviewStatus,
  type LessonStatus,
  type UnitReviewStatus,
} from '../lib/progression';
import { useCompletedReviewsSet, useCompletedSet, useProgress } from '../store/progress';

type Props = {
  onStart: (lessonId: string) => void;
  onStartReview: (unitId: string) => void;
};

export function LessonPath({ onStart, onStartReview }: Props) {
  const completed = useCompletedSet();
  const completedReviews = useCompletedReviewsSet();
  const mistakes = useProgress((s) => s.mistakes);
  const next = nextLessonId(completed, curriculum);

  return (
    <div className="space-y-8">
      {next === null && (
        <div className="rounded-xl border-2 border-brand bg-brand/10 p-4 text-center">
          <div className="text-lg font-bold text-brand-dark">
            You finished every lesson available!
          </div>
          <div className="text-sm text-slate-600 mt-1">
            Don't forget to run each unit's review. More units are on the way.
          </div>
        </div>
      )}

      {curriculum.map((unit) => {
        const reviewStatus = unitReviewStatus(
          unit.id,
          completed,
          completedReviews,
          curriculum,
        );
        const unitMistakeCount = (mistakes[unit.id] ?? []).length;
        return (
          <section key={unit.id}>
            <div className="mb-3">
              <h2 className="text-lg font-bold text-slate-800">{unit.title}</h2>
              <p className="text-sm text-slate-500">{unit.description}</p>
            </div>
            <ol className="space-y-3">
              {unit.lessons.map((lesson) => {
                const status = lessonStatus(lesson.id, completed, curriculum);
                const isNext = lesson.id === next;
                return (
                  <li key={lesson.id}>
                    <button
                      disabled={status === 'locked'}
                      onClick={() => onStart(lesson.id)}
                      className={[
                        'w-full flex items-center gap-4 rounded-xl border-2 p-4 text-left transition',
                        status === 'done' &&
                          'border-brand bg-brand/10 hover:bg-brand/20',
                        status === 'available' &&
                          'border-slate-300 bg-white hover:border-brand hover:bg-brand/5',
                        status === 'locked' &&
                          'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed',
                        isNext &&
                          status === 'available' &&
                          'ring-4 ring-brand/40',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      <NodeIcon status={status} />
                      <div className="flex-1">
                        <div className="font-semibold">{lesson.title}</div>
                        <div className="text-xs text-slate-500">
                          {lesson.questions.length} questions · +{lesson.xp} XP
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}

              {unit.finalReview && (
                <li>
                  <button
                    disabled={reviewStatus === 'locked'}
                    onClick={() => onStartReview(unit.id)}
                    className={[
                      'w-full flex items-center gap-4 rounded-xl border-2 p-4 text-left transition',
                      reviewStatus === 'done' &&
                        'border-amber-400 bg-amber-50 hover:bg-amber-100',
                      reviewStatus === 'available' &&
                        'border-amber-300 bg-amber-50 hover:border-amber-500',
                      reviewStatus === 'locked' &&
                        'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <ReviewIcon status={reviewStatus} />
                    <div className="flex-1">
                      <div className="font-semibold">
                        {unit.title} · Review
                      </div>
                      <div className="text-xs text-slate-500">
                        {reviewStatus === 'locked'
                          ? 'Finish every lesson above to unlock'
                          : `Retry wrong answers${unitMistakeCount ? ` (${unitMistakeCount})` : ''} + ${unit.finalReview.length} cross-cutting questions · +${unit.reviewXp ?? 25} XP`}
                      </div>
                    </div>
                  </button>
                </li>
              )}
            </ol>
          </section>
        );
      })}
    </div>
  );
}

function NodeIcon({ status }: { status: LessonStatus }) {
  if (status === 'done') {
    return (
      <div className="h-10 w-10 rounded-full bg-brand text-white flex items-center justify-center font-bold">
        ✓
      </div>
    );
  }
  if (status === 'available') {
    return (
      <div className="h-10 w-10 rounded-full border-2 border-brand text-brand-dark flex items-center justify-center font-bold">
        ★
      </div>
    );
  }
  return (
    <div className="h-10 w-10 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center font-bold">
      🔒
    </div>
  );
}

function ReviewIcon({ status }: { status: UnitReviewStatus }) {
  if (status === 'done') {
    return (
      <div className="h-10 w-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">
        🏆
      </div>
    );
  }
  if (status === 'available') {
    return (
      <div className="h-10 w-10 rounded-full border-2 border-amber-500 text-amber-700 flex items-center justify-center font-bold">
        🔁
      </div>
    );
  }
  return (
    <div className="h-10 w-10 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center font-bold">
      🔒
    </div>
  );
}
