import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import type { Lesson, Question } from '../content/types';
import { useProgress } from '../store/progress';
import { curriculum } from '../content';
import {
  mistakeKey,
  selectReviewQuestions,
  unitForLesson,
  isLastLessonInUnit,
} from '../lib/progression';
import { unitAccent } from '../lib/unit-accents';
import { ConceptDiagram } from './ConceptDiagram';
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
  const unit = unitForLesson(lesson.id, curriculum)!;
  const accent = unitAccent(unit.id);

  const step = steps[stepIdx];
  const totalQuestions = steps.filter((s) => s.kind === 'question').length;
  const currentQuestionNumber =
    step.kind === 'question'
      ? steps.slice(0, stepIdx + 1).filter((s) => s.kind === 'question').length
      : null;

  const completeAndExit = (finalWrong: string[]) => {
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
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label="Quit lesson"
        >
          <X size={18} />
        </button>
        <div className="flex-1 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className={`h-full rounded-full ${accent.bg} ${accent.darkBg} transition-all`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {currentQuestionNumber !== null && (
          <div className="font-mono text-xs font-medium text-slate-500 dark:text-slate-400">
            {currentQuestionNumber} / {totalQuestions}
          </div>
        )}
      </div>

      {step.kind === 'intro' && (
        <div className="space-y-4 animate-fade-in">
          <ConceptDiagram lessonId={lesson.id} />
          <IntroCard
            title={lesson.title}
            intro={lesson.intro}
            onContinue={advanceFromNonQuestion}
          />
        </div>
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
