import { describe, it, expect } from 'vitest';
import {
  flattenLessons,
  isUnlocked,
  lessonStatus,
  nextLessonId,
} from '../lib/progression';
import { curriculum } from '../content';

const ids = flattenLessons(curriculum).map((l) => l.id);

describe('progression', () => {
  it('has at least two units with lessons', () => {
    expect(curriculum.length).toBeGreaterThanOrEqual(2);
    expect(ids.length).toBeGreaterThanOrEqual(10);
  });

  it('first lesson is unlocked at start, everything else is locked', () => {
    const done = new Set<string>();
    expect(lessonStatus(ids[0], done, curriculum)).toBe('available');
    for (let i = 1; i < ids.length; i++) {
      expect(lessonStatus(ids[i], done, curriculum)).toBe('locked');
    }
  });

  it('completing lesson N unlocks lesson N+1 and leaves N+2 locked', () => {
    const done = new Set<string>([ids[0]]);
    expect(lessonStatus(ids[0], done, curriculum)).toBe('done');
    expect(lessonStatus(ids[1], done, curriculum)).toBe('available');
    if (ids.length > 2) {
      expect(lessonStatus(ids[2], done, curriculum)).toBe('locked');
    }
  });

  it('nextLessonId returns the first incomplete lesson', () => {
    expect(nextLessonId(new Set(), curriculum)).toBe(ids[0]);
    expect(nextLessonId(new Set([ids[0]]), curriculum)).toBe(ids[1]);
  });

  it('returns null when every lesson is complete', () => {
    const done = new Set(ids);
    expect(nextLessonId(done, curriculum)).toBeNull();
  });

  it('isUnlocked matches status', () => {
    const done = new Set<string>([ids[0]]);
    expect(isUnlocked(ids[0], done, curriculum)).toBe(true);
    expect(isUnlocked(ids[1], done, curriculum)).toBe(true);
    if (ids.length > 2) {
      expect(isUnlocked(ids[2], done, curriculum)).toBe(false);
    }
  });

  it('every lesson has at least one real-world example and one analogy', () => {
    for (const l of flattenLessons(curriculum)) {
      expect(l.examples.length).toBeGreaterThanOrEqual(1);
      expect(l.analogies.length).toBeGreaterThanOrEqual(1);
      expect(l.questions.length).toBeGreaterThanOrEqual(5);
    }
  });
});
