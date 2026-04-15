import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import type { Question } from '../content/types';
import { CardShell } from './CardShell';
import { MultipleChoice } from './questions/MultipleChoice';
import { TrueFalse } from './questions/TrueFalse';
import { FillBlank } from './questions/FillBlank';

type Props = {
  question: Question;
  reviewFromLessonTitle?: string;
  onFinish: (wasCorrect: boolean) => void;
};

export function QuestionCard({
  question,
  reviewFromLessonTitle,
  onFinish,
}: Props) {
  const [answered, setAnswered] = useState<boolean | null>(null);

  return (
    <CardShell
      footer={
        answered !== null ? (
          <button
            onClick={() => onFinish(answered)}
            className="w-full rounded-2xl bg-indigo-500 px-4 py-3 font-semibold text-white transition hover:bg-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            Continue
          </button>
        ) : null
      }
    >
      {reviewFromLessonTitle && (
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300">
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Review · from "{reviewFromLessonTitle}"</span>
        </div>
      )}
      {question.kind === 'mcq' && (
        <MultipleChoice question={question} onAnswered={setAnswered} />
      )}
      {question.kind === 'tf' && (
        <TrueFalse question={question} onAnswered={setAnswered} />
      )}
      {question.kind === 'fill' && (
        <FillBlank question={question} onAnswered={setAnswered} />
      )}
    </CardShell>
  );
}
