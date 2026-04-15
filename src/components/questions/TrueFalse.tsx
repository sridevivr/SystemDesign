import { useState } from 'react';
import type { TrueFalseQuestion } from '../../content/types';
import { FeedbackBox } from './MultipleChoice';

type Props = {
  question: TrueFalseQuestion;
  onAnswered: (wasCorrect: boolean) => void;
};

export function TrueFalse({ question, onAnswered }: Props) {
  const [selected, setSelected] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const wasCorrect = selected === question.answer;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-semibold text-slate-800">{question.prompt}</p>
      <div className="grid grid-cols-2 gap-2">
        {[true, false].map((val) => {
          const isSelected = selected === val;
          const isAnswer = val === question.answer;
          const showCorrect = submitted && isAnswer;
          const showWrong = submitted && isSelected && !isAnswer;
          return (
            <button
              key={String(val)}
              disabled={submitted}
              onClick={() => setSelected(val)}
              className={[
                'rounded-xl border-2 py-4 font-bold transition',
                !submitted && isSelected && 'border-brand bg-brand/10',
                !submitted && !isSelected && 'border-slate-200 hover:border-slate-300',
                showCorrect && 'border-brand bg-brand/20',
                showWrong && 'border-red-400 bg-red-50',
                submitted && !isSelected && !isAnswer && 'opacity-60',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {val ? 'True' : 'False'}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button
          disabled={selected === null}
          onClick={() => {
            setSubmitted(true);
            onAnswered(selected === question.answer);
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
