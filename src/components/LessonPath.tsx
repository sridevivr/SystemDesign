import { Check, Lock, Sparkles, Star, Trophy } from 'lucide-react';
import { curriculum } from '../content';
import {
  lessonStatus,
  nextLessonId,
  unitReviewStatus,
  type LessonStatus,
  type UnitReviewStatus,
} from '../lib/progression';
import { unitAccent, type UnitAccent } from '../lib/unit-accents';
import { useCompletedReviewsSet, useCompletedSet, useProgress } from '../store/progress';
import { WelcomeCard } from './WelcomeCard';

type Props = {
  onStart: (lessonId: string) => void;
  onStartReview: (unitId: string) => void;
};

const OFFSETS = [
  'ml-0',
  'ml-0 sm:ml-12',
  'ml-0 sm:ml-20',
  'ml-0 sm:ml-12',
] as const;
function offsetForIndex(i: number): string {
  return OFFSETS[i % OFFSETS.length];
}

export function LessonPath({ onStart, onStartReview }: Props) {
  const completed = useCompletedSet();
  const completedReviews = useCompletedReviewsSet();
  const mistakes = useProgress((s) => s.mistakes);
  const next = nextLessonId(completed, curriculum);

  return (
    <div className="space-y-12">
      <WelcomeCard />

      {next === null && (
        <div className="flex items-center gap-3 rounded-3xl border border-primary-200 bg-primary-50 p-5 shadow-soft animate-fade-in dark:border-primary-500/30 dark:bg-primary-500/10 dark:shadow-soft-dark">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-500 text-white">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <div className="text-base font-semibold text-primary-700 dark:text-primary-200">
              You finished every lesson available.
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Run each unit's review to lock it in. More units are on the way.
            </div>
          </div>
        </div>
      )}

      {curriculum.map((unit) => {
        const accent = unitAccent(unit.id);
        const reviewStatus = unitReviewStatus(
          unit.id,
          completed,
          completedReviews,
          curriculum,
        );
        const unitMistakeCount = (mistakes[unit.id] ?? []).length;
        const doneCount = unit.lessons.filter((l) => completed.has(l.id)).length;
        const totalCount = unit.lessons.length;

        return (
          <section key={unit.id} className="animate-fade-in">
            <UnitHeader
              title={unit.title}
              description={unit.description}
              accent={accent}
              doneCount={doneCount}
              totalCount={totalCount}
            />

            <ol className="relative mt-6 space-y-5">
              {unit.lessons.map((lesson, i) => {
                const status = lessonStatus(lesson.id, completed, curriculum);
                const isNext = lesson.id === next;
                const isLast = i === unit.lessons.length - 1;
                return (
                  <li
                    key={lesson.id}
                    className={`relative flex items-center gap-4 ${offsetForIndex(i)}`}
                  >
                    {!isLast && (
                      <span
                        aria-hidden
                        className={`pointer-events-none absolute left-8 top-16 h-8 border-l-2 border-dashed ${accent.border} ${accent.darkBorder} opacity-50`}
                      />
                    )}
                    <LessonNode
                      status={status}
                      isNext={isNext}
                      index={i}
                      accent={accent}
                      title={lesson.title}
                      onClick={() => onStart(lesson.id)}
                    />
                    <LessonCard
                      status={status}
                      isNext={isNext}
                      title={lesson.title}
                      meta={`${lesson.questions.length} questions  ·  +${lesson.xp} XP`}
                      accent={accent}
                      onClick={() => onStart(lesson.id)}
                    />
                  </li>
                );
              })}

              {unit.finalReview && (
                <li className={`relative flex items-center gap-4 ${offsetForIndex(unit.lessons.length)}`}>
                  <UnitReviewNode
                    status={reviewStatus}
                    accent={accent}
                    onClick={() => onStartReview(unit.id)}
                  />
                  <LessonCard
                    status={reviewStatus === 'locked' ? 'locked' : 'available'}
                    isNext={false}
                    title={`${unit.title} · Review`}
                    meta={
                      reviewStatus === 'locked'
                        ? 'Finish every lesson above to unlock'
                        : `Retry wrong answers${unitMistakeCount ? ` (${unitMistakeCount})` : ''} + ${unit.finalReview.length} cross-cutting · +${unit.reviewXp ?? 25} XP`
                    }
                    accent={accent}
                    onClick={() => onStartReview(unit.id)}
                  />
                </li>
              )}
            </ol>
          </section>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Subcomponents
// ---------------------------------------------------------------------------

function UnitHeader({
  title,
  description,
  accent,
  doneCount,
  totalCount,
}: {
  title: string;
  description: string;
  accent: UnitAccent;
  doneCount: number;
  totalCount: number;
}) {
  return (
    <div
      className={`flex items-start justify-between gap-4 rounded-2xl border-l-4 ${accent.border} ${accent.darkBorder} ${accent.bgSoft} ${accent.darkBgSoft} px-5 py-4 shadow-soft dark:shadow-soft-dark`}
    >
      <div className="min-w-0">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
      <span
        className={`shrink-0 rounded-full border ${accent.border} ${accent.darkBorder} bg-white/70 px-3 py-1 font-mono text-xs font-medium ${accent.text} ${accent.darkText} dark:bg-slate-900/40`}
      >
        {doneCount} / {totalCount}
      </span>
    </div>
  );
}

function LessonNode({
  status,
  isNext,
  index,
  accent,
  title,
  onClick,
}: {
  status: LessonStatus;
  isNext: boolean;
  index: number;
  accent: UnitAccent;
  title: string;
  onClick: () => void;
}) {
  const base =
    'relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 font-semibold transition active:scale-95';

  let stateClasses = '';
  let inner: React.ReactNode = null;

  if (status === 'done') {
    stateClasses = `${accent.bg} ${accent.darkBg} ${accent.border} ${accent.darkBorder} text-white shadow-soft dark:shadow-soft-dark hover:brightness-110`;
    inner = <Check className="h-7 w-7" strokeWidth={3} />;
  } else if (status === 'available') {
    stateClasses = `bg-white dark:bg-slate-900 ${accent.border} ${accent.darkBorder} ${accent.text} ${accent.darkText} shadow-soft dark:shadow-soft-dark hover:scale-105`;
    inner = isNext ? (
      <Star className="h-7 w-7" strokeWidth={2.25} />
    ) : (
      <span className="font-mono text-base">{index + 1}</span>
    );
  } else {
    stateClasses =
      'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed';
    inner = <Lock className="h-6 w-6" />;
  }

  return (
    <button
      type="button"
      disabled={status === 'locked'}
      onClick={onClick}
      aria-label={title}
      className={`${base} ${stateClasses}`}
    >
      {isNext && status === 'available' && (
        <span
          aria-hidden
          className={`absolute inset-0 rounded-full ring-4 ${accent.ring} ${accent.darkRing} animate-pulse-ring`}
        />
      )}
      {inner}
    </button>
  );
}

function UnitReviewNode({
  status,
  accent,
  onClick,
}: {
  status: UnitReviewStatus;
  accent: UnitAccent;
  onClick: () => void;
}) {
  const base =
    'relative z-10 flex h-16 w-16 shrink-0 rotate-45 items-center justify-center rounded-2xl border-2 transition active:scale-95';
  const iconWrap = '-rotate-45 flex items-center justify-center';

  let stateClasses = '';
  let icon: React.ReactNode = null;

  if (status === 'done') {
    stateClasses = `${accent.bg} ${accent.darkBg} ${accent.border} ${accent.darkBorder} text-white shadow-soft dark:shadow-soft-dark hover:brightness-110`;
    icon = <Trophy className="h-7 w-7" strokeWidth={2.5} />;
  } else if (status === 'available') {
    stateClasses = `bg-white dark:bg-slate-900 ${accent.border} ${accent.darkBorder} ${accent.text} ${accent.darkText} shadow-soft dark:shadow-soft-dark hover:scale-105`;
    icon = <Sparkles className="h-7 w-7" strokeWidth={2.25} />;
  } else {
    stateClasses =
      'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed';
    icon = <Lock className="h-6 w-6" />;
  }

  return (
    <button
      type="button"
      disabled={status === 'locked'}
      onClick={onClick}
      aria-label="Unit review"
      className={`${base} ${stateClasses}`}
    >
      {status === 'available' && (
        <span
          aria-hidden
          className={`absolute inset-0 rounded-2xl ring-4 ${accent.ring} ${accent.darkRing} animate-pulse-ring`}
        />
      )}
      <span className={iconWrap}>{icon}</span>
    </button>
  );
}

function LessonCard({
  status,
  isNext,
  title,
  meta,
  accent,
  onClick,
}: {
  status: LessonStatus;
  isNext: boolean;
  title: string;
  meta: string;
  accent: UnitAccent;
  onClick: () => void;
}) {
  const base =
    'group flex-1 rounded-2xl border px-4 py-3 text-left transition shadow-soft dark:shadow-soft-dark';
  let stateClasses = '';
  if (status === 'locked') {
    stateClasses =
      'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500 cursor-not-allowed';
  } else if (isNext) {
    stateClasses = `bg-white dark:bg-slate-900 ${accent.border} ${accent.darkBorder} hover:-translate-y-0.5`;
  } else {
    stateClasses =
      'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-slate-700';
  }

  return (
    <button
      type="button"
      disabled={status === 'locked'}
      onClick={onClick}
      className={`${base} ${stateClasses}`}
    >
      <div
        className={`text-sm font-semibold ${
          status === 'locked'
            ? 'text-slate-400 dark:text-slate-500'
            : 'text-slate-800 dark:text-slate-100'
        }`}
      >
        {title}
      </div>
      <div className="mt-0.5 font-mono text-xs text-slate-500 dark:text-slate-400">
        {meta}
      </div>
    </button>
  );
}
