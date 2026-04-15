import { useState } from 'react';
import { Check, X } from 'lucide-react';
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
      <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
        {question.prompt}
      </p>
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
                'rounded-2xl border px-4 py-3 text-left font-medium transition',
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

export function FeedbackBox({
  correct,
  explain,
}: {
  correct: boolean;
  explain: string;
}) {
  return (
    <div
      className={
        'rounded-2xl border p-4 ' +
        (correct
          ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10'
          : 'border-rose-500 bg-rose-50 dark:border-rose-500/40 dark:bg-rose-500/10')
      }
    >
      <div
        className={
          'flex items-center gap-1.5 text-sm font-semibold ' +
          (correct
            ? 'text-emerald-700 dark:text-emerald-300'
            : 'text-rose-700 dark:text-rose-300')
        }
      >
        {correct ? (
          <Check className="h-4 w-4" />
        ) : (
          <X className="h-4 w-4" />
        )}
        <span>{correct ? 'Correct' : 'Not quite'}</span>
      </div>
      <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">
        {explain}
      </div>
    </div>
  );
}
