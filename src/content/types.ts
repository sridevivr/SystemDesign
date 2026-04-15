// Content model for lessons. Every lesson MUST include at least one
// real-world company example and at least one everyday analogy — the
// tuple types below enforce this at compile time.

export type MCQQuestion = {
  kind: 'mcq';
  prompt: string;
  options: string[];
  answerIndex: number;
  explain: string;
};

export type TrueFalseQuestion = {
  kind: 'tf';
  prompt: string;
  answer: boolean;
  explain: string;
};

export type FillBlankQuestion = {
  kind: 'fill';
  prompt: string;
  // Case-insensitive compare. Multiple accepted answers allowed.
  answers: string[];
  explain: string;
};

export type Question = MCQQuestion | TrueFalseQuestion | FillBlankQuestion;

export type RealWorldExample = {
  company: string;
  scenario: string;
};

export type Analogy = {
  title: string;
  body: string;
};

export type Lesson = {
  id: string;
  title: string;
  intro: string;
  // At least one example and one analogy, enforced via tuple type.
  examples: [RealWorldExample, ...RealWorldExample[]];
  analogies: [Analogy, ...Analogy[]];
  questions: Question[];
  xp: number;
};

export type Unit = {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
};
