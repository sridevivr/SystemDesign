import { useMemo, useState } from 'react';
import type { Lesson } from '../content/types';
import { useProgress } from '../store/progress';
import { IntroCard } from './IntroCard';
import { ExampleCard } from './ExampleCard';
import { AnalogyCard } from './AnalogyCard';
import { CardShell } from './CardShell';
import { MultipleChoice } from './questions/MultipleChoice';
import { TrueFalse } from './questions/TrueFalse';
import { FillBlank } from './questions/FillBlank';

type Props = {
  lesson: Lesson;
  onDone: (xpAwarded: number) => void;
  onQuit: () => void;
};

// Flattened sequence of "steps" shown inside a lesson. Pedagogical order:
// intro → examples → analogies → questions.
type Step =
  | { kind: 'intro' }
  | { kind: 'example'; index: number }
  | { kind: 'analogy'; index: number }
  | { kind: 'question'; index: number };

function buildSteps(lesson: Lesson): Step[] {
  const steps: Step[] = [{ kind: 'intro' }];
  lesson.examples.forEach((_, i) => steps.push({ kind: 'example', index: i }));
  lesson.analogies.forEach((_, i) => steps.push({ kind: 'analogy', index: i }));
  lesson.questions.forEach((_, i) => steps.push({ kind: 'question', index: i }));
  return steps;
}

export function LessonRunner({ lesson, onDone, onQuit }: Props) {
  const steps = useMemo(() => buildSteps(lesson), [lesson]);
  const [stepIdx, setStepIdx] = useState(0);
  const [answeredThisStep, setAnsweredThisStep] = useState(false);
  const completeLesson = useProgress((s) => s.completeLesson);

  const step = steps[stepIdx];
  const totalQuestions = lesson.questions.length;
  const currentQuestionNumber =
    step.kind === 'question' ? step.index + 1 : null;

  const advance = () => {
    setAnsweredThisStep(false);
    if (stepIdx + 1 >= steps.length) {
      completeLesson(lesson.id, lesson.xp);
      onDone(lesson.xp);
      return;
    }
    setStepIdx(stepIdx + 1);
  };

  // Overall progress bar: count learning-cards + questions evenly.
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
        <IntroCard title={lesson.title} intro={lesson.intro} onContinue={advance} />
      )}

      {step.kind === 'example' && (
        <ExampleCard example={lesson.examples[step.index]} onContinue={advance} />
      )}

      {step.kind === 'analogy' && (
        <AnalogyCard analogy={lesson.analogies[step.index]} onContinue={advance} />
      )}

      {step.kind === 'question' && (
        <CardShell
          footer={
            answeredThisStep ? (
              <button
                onClick={advance}
                className="w-full rounded-xl bg-brand text-white font-bold py-3 hover:bg-brand-dark"
              >
                Continue
              </button>
            ) : null
          }
        >
          <QuestionBody
            lesson={lesson}
            stepIndex={step.index}
            onAnswered={() => setAnsweredThisStep(true)}
          />
        </CardShell>
      )}
    </div>
  );
}

function QuestionBody({
  lesson,
  stepIndex,
  onAnswered,
}: {
  lesson: Lesson;
  stepIndex: number;
  onAnswered: () => void;
}) {
  const q = lesson.questions[stepIndex];
  if (q.kind === 'mcq') return <MultipleChoice question={q} onAnswered={onAnswered} />;
  if (q.kind === 'tf') return <TrueFalse question={q} onAnswered={onAnswered} />;
  return <FillBlank question={q} onAnswered={onAnswered} />;
}
