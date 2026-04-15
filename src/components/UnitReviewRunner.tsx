import { useMemo, useState } from 'react';
import type { Question } from '../content/types';
import { useProgress } from '../store/progress';
import { curriculum } from '../content';
import { resolveMistakeQuestion } from '../lib/progression';
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
      <div className="rounded-2xl border-2 border-brand bg-brand/10 p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-brand-dark">
          Nothing to review yet!
        </h2>
        <p className="text-sm text-slate-600">
          Finish a few more lessons and this review will fill up.
        </p>
        <button
          onClick={onQuit}
          className="w-full rounded-xl bg-brand text-white font-bold py-3 hover:bg-brand-dark"
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
          className="text-slate-400 hover:text-slate-600 text-xl"
          aria-label="Quit review"
        >
          ✕
        </button>
        <div className="flex-1 h-3 rounded-full bg-amber-200 overflow-hidden">
          <div
            className="h-full bg-amber-500 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          {stepIdx + 1} / {steps.length}
        </div>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
        <span className="font-bold">{unit.title} · Review.</span>{' '}
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
