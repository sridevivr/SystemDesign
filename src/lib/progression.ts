import type { Lesson, Unit, Question } from '../content/types';

export type LessonStatus = 'done' | 'available' | 'locked';
export type UnitReviewStatus = 'locked' | 'available' | 'done';

export type ReviewItem = {
  question: Question;
  sourceLessonId: string;
  sourceLessonTitle: string;
  sourceQuestionIndex: number;
};

export type ResolvedMistake = {
  question: Question;
  lessonId: string;
  lessonTitle: string;
  questionIndex: number;
};

export function flattenLessons(curriculum: Unit[]): Lesson[] {
  return curriculum.flatMap((u) => u.lessons);
}

export function unitForLesson(
  lessonId: string,
  curriculum: Unit[],
): Unit | undefined {
  return curriculum.find((u) => u.lessons.some((l) => l.id === lessonId));
}

export function isLastLessonInUnit(
  lessonId: string,
  curriculum: Unit[],
): boolean {
  const unit = unitForLesson(lessonId, curriculum);
  if (!unit) return false;
  return unit.lessons[unit.lessons.length - 1].id === lessonId;
}

// Deterministic selection of review questions from prior lessons in the
// same unit. For the Nth lesson (N >= 1), we pick `count` questions from
// the union of all prior lessons, rotating most-recent-first. Results are
// stable across invocations so the user doesn't see random churn.
export function selectReviewQuestions(
  lessonId: string,
  curriculum: Unit[],
  count = 2,
): ReviewItem[] {
  const unit = unitForLesson(lessonId, curriculum);
  if (!unit) return [];
  const lessonIdx = unit.lessons.findIndex((l) => l.id === lessonId);
  if (lessonIdx <= 0) return [];
  const priors = unit.lessons.slice(0, lessonIdx);
  if (priors.length === 0) return [];

  const items: ReviewItem[] = [];
  for (let i = 0; i < count; i++) {
    const priorIdx = priors.length - 1 - (i % priors.length);
    const source = priors[priorIdx];
    if (source.questions.length === 0) continue;
    const qIdx = (lessonIdx * 7 + i * 13) % source.questions.length;
    items.push({
      question: source.questions[qIdx],
      sourceLessonId: source.id,
      sourceLessonTitle: source.title,
      sourceQuestionIndex: qIdx,
    });
  }
  return items;
}

export function mistakeKey(lessonId: string, questionIndex: number): string {
  return `${lessonId}:${questionIndex}`;
}

export function resolveMistakeQuestion(
  key: string,
  curriculum: Unit[],
): ResolvedMistake | null {
  const sep = key.lastIndexOf(':');
  if (sep === -1) return null;
  const lessonId = key.slice(0, sep);
  const idx = parseInt(key.slice(sep + 1), 10);
  if (Number.isNaN(idx)) return null;
  for (const unit of curriculum) {
    const lesson = unit.lessons.find((l) => l.id === lessonId);
    if (lesson && idx >= 0 && idx < lesson.questions.length) {
      return {
        question: lesson.questions[idx],
        lessonId,
        lessonTitle: lesson.title,
        questionIndex: idx,
      };
    }
  }
  return null;
}

export function lessonStatus(
  lessonId: string,
  completedIds: ReadonlySet<string>,
  curriculum: Unit[],
): LessonStatus {
  const flat = flattenLessons(curriculum);
  const idx = flat.findIndex((l) => l.id === lessonId);
  if (idx === -1) return 'locked';
  if (completedIds.has(lessonId)) return 'done';
  for (let i = 0; i < idx; i++) {
    if (!completedIds.has(flat[i].id)) return 'locked';
  }
  return 'available';
}

export function isUnlocked(
  lessonId: string,
  completedIds: ReadonlySet<string>,
  curriculum: Unit[],
): boolean {
  const s = lessonStatus(lessonId, completedIds, curriculum);
  return s === 'available' || s === 'done';
}

export function nextLessonId(
  completedIds: ReadonlySet<string>,
  curriculum: Unit[],
): string | null {
  const flat = flattenLessons(curriculum);
  for (const l of flat) {
    if (!completedIds.has(l.id)) return l.id;
  }
  return null;
}

export function totalLessons(curriculum: Unit[]): number {
  return flattenLessons(curriculum).length;
}

export function unitReviewStatus(
  unitId: string,
  completedIds: ReadonlySet<string>,
  completedReviews: ReadonlySet<string>,
  curriculum: Unit[],
): UnitReviewStatus {
  const unit = curriculum.find((u) => u.id === unitId);
  if (!unit) return 'locked';
  const allDone = unit.lessons.every((l) => completedIds.has(l.id));
  if (!allDone) return 'locked';
  if (completedReviews.has(unitId)) return 'done';
  return 'available';
}
