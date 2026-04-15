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
      <p className="text-lg font-semibold text-slate-800">{question.prompt}</p>
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
        className="rounded-xl border-2 border-slate-200 px-4 py-3 focus:border-brand outline-none"
      />

      {!submitted ? (
        <button
          disabled={!value.trim()}
          onClick={() => {
            setSubmitted(true);
            onAnswered(acceptable.includes(normalize(value)));
          }}
          className="w-full rounded-xl bg-brand text-white font-bold py-3 disabled:bg-slate-300 hover:bg-brand-dark"
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
