import { useState } from 'react';
import type { MCQQuestion } from '../../content/types';

type Props = {
  question: MCQQuestion;
  onAnswered: (wasCorrect: boolean) => void;
};

export function MultipleChoice({ question, onAnswered }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const wasCorrect = selected === question.answerIndex;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-semibold text-slate-800">{question.prompt}</p>
      <div className="flex flex-col gap-2">
        {question.options.map((opt, i) => {
          const isSelected = selected === i;
          const isAnswer = i === question.answerIndex;
          const showCorrect = submitted && isAnswer;
          const showWrong = submitted && isSelected && !isAnswer;
          return (
            <button
              key={i}
              disabled={submitted}
              onClick={() => setSelected(i)}
              className={[
                'rounded-xl border-2 px-4 py-3 text-left font-medium transition',
                !submitted && isSelected && 'border-brand bg-brand/10',
                !submitted && !isSelected && 'border-slate-200 hover:border-slate-300',
                showCorrect && 'border-brand bg-brand/20',
                showWrong && 'border-red-400 bg-red-50',
                submitted && !isSelected && !isAnswer && 'opacity-60',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button
          disabled={selected === null}
          onClick={() => {
            setSubmitted(true);
            onAnswered(selected === question.answerIndex);
          }}
          className="w-full rounded-xl bg-brand text-white font-bold py-3 disabled:bg-slate-300 hover:bg-brand-dark"
        >
          Check
        </button>
      ) : (
        <FeedbackBox correct={wasCorrect} explain={question.explain} />
      )}
    </div>
  );
}

export function FeedbackBox({ correct, explain }: { correct: boolean; explain: string }) {
  return (
    <div
      className={
        'rounded-xl border-2 p-3 ' +
        (correct ? 'border-brand bg-brand/10' : 'border-red-300 bg-red-50')
      }
    >
      <div className={'font-bold ' + (correct ? 'text-brand-dark' : 'text-red-600')}>
        {correct ? 'Correct!' : 'Not quite'}
      </div>
      <div className="text-sm text-slate-700 mt-1">{explain}</div>
    </div>
  );
}
