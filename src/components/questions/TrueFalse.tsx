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
      <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
        {question.prompt}
      </p>
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
                'rounded-2xl border py-4 font-semibold transition',
                'text-slate-800 dark:text-slate-100',
                !submitted &&
                  isSelected &&
                  'border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-500/10',
                !submitted &&
                  !isSelected &&
                  'border-slate-300 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-500',
                showCorrect &&
                  'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300',
                showWrong &&
                  'border-rose-500 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300',
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
          className="w-full rounded-2xl bg-indigo-500 px-4 py-3 font-semibold text-white transition hover:bg-indigo-600 disabled:bg-slate-300 disabled:hover:bg-slate-300 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
        >
          Check
        </button>
      ) : (
        <FeedbackBox correct={wasCorrect} explain={question.explain} />
      )}
    </div>
  );
}
