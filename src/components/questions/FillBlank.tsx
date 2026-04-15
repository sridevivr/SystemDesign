import { useState } from 'react';
import type { FillBlankQuestion } from '../../content/types';
import { FeedbackBox } from './MultipleChoice';

type Props = {
  question: FillBlankQuestion;
  onAnswered: (wasCorrect: boolean) => void;
};

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export function FillBlank({ question, onAnswered }: Props) {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const acceptable = question.answers.map(normalize);
  const wasCorrect = acceptable.includes(normalize(value));

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
        {question.prompt}
      </p>
      <input
        type="text"
        value={value}
        disabled={submitted}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && value.trim() && !submitted) {
            setSubmitted(true);
            onAnswered(acceptable.includes(normalize(value)));
          }
        }}
        placeholder="Type your answer…"
        className="rounded-2xl border border-slate-300 bg-white px-4 py-3 font-mono text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-500 dark:focus:border-indigo-400"
      />

      {!submitted ? (
        <button
          disabled={!value.trim()}
          onClick={() => {
            setSubmitted(true);
            onAnswered(acceptable.includes(normalize(value)));
          }}
          className="w-full rounded-2xl bg-indigo-500 px-4 py-3 font-semibold text-white transition hover:bg-indigo-600 disabled:bg-slate-300 disabled:hover:bg-slate-300 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
        >
          Check
        </button>
      ) : (
        <FeedbackBox
          correct={wasCorrect}
          explain={
            wasCorrect
              ? question.explain
              : `Answer: ${question.answers[0]}. ${question.explain}`
          }
        />
      )}
    </div>
  );
}
