import { useState } from 'react';
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
            className="w-full rounded-xl bg-brand text-white font-bold py-3 hover:bg-brand-dark"
          >
            Continue
          </button>
        ) : null
      }
    >
      {reviewFromLessonTitle && (
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
          <span>🔁</span>
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
