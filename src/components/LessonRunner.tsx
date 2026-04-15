import { useMemo, useState } from 'react';
import type { Lesson, Question } from '../content/types';
import { useProgress } from '../store/progress';
import { curriculum } from '../content';
import {
  mistakeKey,
  selectReviewQuestions,
  unitForLesson,
  isLastLessonInUnit,
} from '../lib/progression';
import { IntroCard } from './IntroCard';
import { ExampleCard } from './ExampleCard';
import { AnalogyCard } from './AnalogyCard';
import { QuestionCard } from './QuestionCard';

type Props = {
  lesson: Lesson;
  onDone: (result: {
    xpAwarded: number;
    wasLastInUnit: boolean;
    unitId: string;
  }) => void;
  onQuit: () => void;
};

// Flattened sequence of "steps" shown inside a lesson. Pedagogical order:
// intro → examples → analogies → questions → review questions from prior
// lessons in the same unit.
type Step =
  | { kind: 'intro' }
  | { kind: 'example'; index: number }
  | { kind: 'analogy'; index: number }
  | {
      kind: 'question';
      question: Question;
      sourceLessonId: string;
      sourceQuestionIndex: number;
      reviewFromTitle?: string;
    };

function buildSteps(lesson: Lesson): Step[] {
  const steps: Step[] = [{ kind: 'intro' }];
  lesson.examples.forEach((_, i) => steps.push({ kind: 'example', index: i }));
  lesson.analogies.forEach((_, i) => steps.push({ kind: 'analogy', index: i }));
  lesson.questions.forEach((q, i) =>
    steps.push({
      kind: 'question',
      question: q,
      sourceLessonId: lesson.id,
      sourceQuestionIndex: i,
    }),
  );
  const reviews = selectReviewQuestions(lesson.id, curriculum, 2);
  for (const r of reviews) {
    steps.push({
      kind: 'question',
      question: r.question,
      sourceLessonId: r.sourceLessonId,
      sourceQuestionIndex: r.sourceQuestionIndex,
      reviewFromTitle: r.sourceLessonTitle,
    });
  }
  return steps;
}

export function LessonRunner({ lesson, onDone, onQuit }: Props) {
  const steps = useMemo(() => buildSteps(lesson), [lesson]);
  const [stepIdx, setStepIdx] = useState(0);
  const [wrongKeys, setWrongKeys] = useState<string[]>([]);
  const completeLesson = useProgress((s) => s.completeLesson);

  const step = steps[stepIdx];
  const totalQuestions = steps.filter((s) => s.kind === 'question').length;
  const currentQuestionNumber =
    step.kind === 'question'
      ? steps.slice(0, stepIdx + 1).filter((s) => s.kind === 'question').length
      : null;

  const completeAndExit = (finalWrong: string[]) => {
    const unit = unitForLesson(lesson.id, curriculum)!;
    completeLesson(lesson.id, lesson.xp, unit.id, finalWrong);
    onDone({
      xpAwarded: lesson.xp,
      wasLastInUnit: isLastLessonInUnit(lesson.id, curriculum),
      unitId: unit.id,
    });
  };

  const advanceFromNonQuestion = () => {
    if (stepIdx + 1 >= steps.length) return completeAndExit(wrongKeys);
    setStepIdx(stepIdx + 1);
  };

  const advanceFromQuestion = (wasCorrect: boolean) => {
    let newWrong = wrongKeys;
    if (!wasCorrect && step.kind === 'question') {
      const key = mistakeKey(step.sourceLessonId, step.sourceQuestionIndex);
      if (!wrongKeys.includes(key)) {
        newWrong = [...wrongKeys, key];
        setWrongKeys(newWrong);
      }
    }
    if (stepIdx + 1 >= steps.length) return completeAndExit(newWrong);
    setStepIdx(stepIdx + 1);
  };

  const progressPct = Math.round((stepIdx / steps.length) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onQuit}
          className="text-slate-400 hover:text-slate-600 text-xl"
          aria-label="Quit lesson"
        >
          ✕
        </button>
        <div className="flex-1 h-3 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-brand transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {currentQuestionNumber !== null && (
          <div className="text-xs font-semibold text-slate-500">
            {currentQuestionNumber} / {totalQuestions}
          </div>
        )}
      </div>

      {step.kind === 'intro' && (
        <IntroCard
          title={lesson.title}
          intro={lesson.intro}
          onContinue={advanceFromNonQuestion}
        />
      )}
      {step.kind === 'example' && (
        <ExampleCard
          example={lesson.examples[step.index]}
          onContinue={advanceFromNonQuestion}
        />
      )}
      {step.kind === 'analogy' && (
        <AnalogyCard
          analogy={lesson.analogies[step.index]}
          onContinue={advanceFromNonQuestion}
        />
      )}
      {step.kind === 'question' && (
        <QuestionCard
          key={`q-${stepIdx}`}
          question={step.question}
          reviewFromLessonTitle={step.reviewFromTitle}
          onFinish={advanceFromQuestion}
        />
      )}
    </div>
  );
}
