import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import type { Question } from '../content/types';
import { useProgress } from '../store/progress';
import { curriculum } from '../content';
import { resolveMistakeQuestion } from '../lib/progression';
import { unitAccent } from '../lib/unit-accents';
import { QuestionCard } from './QuestionCard';

type Props = {
  unitId: string;
  onDone: (xpAwarded: number) => void;
  onQuit: () => void;
};

type ReviewStep = {
  question: Question;
  reviewFromTitle?: string;
};

function buildReviewSteps(unitId: string, mistakes: string[]): ReviewStep[] {
  const unit = curriculum.find((u) => u.id === unitId);
  if (!unit) return [];
  const steps: ReviewStep[] = [];
  for (const key of mistakes) {
    const resolved = resolveMistakeQuestion(key, curriculum);
    if (resolved) {
      steps.push({
        question: resolved.question,
        reviewFromTitle: resolved.lessonTitle,
      });
    }
  }
  if (unit.finalReview) {
    for (const q of unit.finalReview) {
      steps.push({ question: q });
    }
  }
  return steps;
}

export function UnitReviewRunner({ unitId, onDone, onQuit }: Props) {
  const mistakesSnapshot = useProgress((s) => s.mistakes[unitId] ?? []);
  const completeUnitReview = useProgress((s) => s.completeUnitReview);
  const unit = curriculum.find((u) => u.id === unitId)!;
  const accent = unitAccent(unitId);
  const reviewXp = unit.reviewXp ?? 25;

  // Snapshot mistakes at mount so completing the review and clearing the
  // bucket doesn't cut our own step list short mid-session.
  const steps = useMemo(
    () => buildReviewSteps(unitId, mistakesSnapshot),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [unitId],
  );
  const [stepIdx, setStepIdx] = useState(0);

  if (steps.length === 0) {
    return (
      <div className="animate-fade-in rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:shadow-soft-dark">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          Nothing to review yet.
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Finish a few more lessons and this review will fill up.
        </p>
        <button
          onClick={onQuit}
          className="mt-5 w-full rounded-2xl bg-indigo-500 px-4 py-3 font-semibold text-white transition hover:bg-indigo-600 dark:hover:bg-indigo-400"
        >
          Back
        </button>
      </div>
    );
  }

  const step = steps[stepIdx];
  const progressPct = Math.round((stepIdx / steps.length) * 100);

  const advance = () => {
    if (stepIdx + 1 >= steps.length) {
      completeUnitReview(unitId, reviewXp);
      onDone(reviewXp);
      return;
    }
    setStepIdx(stepIdx + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onQuit}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label="Quit review"
        >
          <X size={18} />
        </button>
        <div className="flex-1 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className={`h-full rounded-full ${accent.bg} ${accent.darkBg} transition-all`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="font-mono text-xs font-medium text-slate-500 dark:text-slate-400">
          {stepIdx + 1} / {steps.length}
        </div>
      </div>

      <div
        className={`rounded-2xl border ${accent.border} ${accent.darkBorder} ${accent.bgSoft} ${accent.darkBgSoft} p-4 text-sm text-slate-700 dark:text-slate-200`}
      >
        <span className={`font-semibold ${accent.text} ${accent.darkText}`}>
          {unit.title} · Review.
        </span>{' '}
        A quick pass over anything you got wrong, plus a few extra questions to
        tie it all together.
      </div>

      <QuestionCard
        key={`review-${unitId}-${stepIdx}`}
        question={step.question}
        reviewFromLessonTitle={step.reviewFromTitle}
        onFinish={advance}
      />
    </div>
  );
}
