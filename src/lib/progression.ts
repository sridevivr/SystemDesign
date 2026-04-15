import type { Lesson, Unit } from '../content/types';

export type LessonStatus = 'done' | 'available' | 'locked';

export function flattenLessons(curriculum: Unit[]): Lesson[] {
  return curriculum.flatMap((u) => u.lessons);
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
  // Available iff all earlier lessons are done.
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
