import { describe, it, expect } from 'vitest';
import {
  flattenLessons,
  isLastLessonInUnit,
  isUnlocked,
  lessonStatus,
  mistakeKey,
  nextLessonId,
  resolveMistakeQuestion,
  selectReviewQuestions,
  unitForLesson,
  unitReviewStatus,
} from '../lib/progression';
import { curriculum } from '../content';

const ids = flattenLessons(curriculum).map((l) => l.id);

describe('progression: lessons and unlocking', () => {
  it('has at least eight units with lessons', () => {
    expect(curriculum.length).toBeGreaterThanOrEqual(8);
    expect(ids.length).toBeGreaterThanOrEqual(40);
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
    expect(lessonStatus(ids[2], done, curriculum)).toBe('locked');
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
    expect(isUnlocked(ids[2], done, curriculum)).toBe(false);
  });
});

describe('progression: content contract', () => {
  it('every lesson has at least one real-world example and one analogy', () => {
    for (const l of flattenLessons(curriculum)) {
      expect(l.examples.length).toBeGreaterThanOrEqual(1);
      expect(l.analogies.length).toBeGreaterThanOrEqual(1);
      expect(l.questions.length).toBeGreaterThanOrEqual(5);
    }
  });

  it('every unit has a finalReview with at least 3 cross-cutting questions', () => {
    for (const u of curriculum) {
      expect(u.finalReview).toBeDefined();
      expect((u.finalReview ?? []).length).toBeGreaterThanOrEqual(3);
    }
  });
});

describe('progression: unit helpers', () => {
  it('unitForLesson finds the owning unit', () => {
    const firstUnit = curriculum[0];
    const firstLesson = firstUnit.lessons[0];
    expect(unitForLesson(firstLesson.id, curriculum)?.id).toBe(firstUnit.id);
  });

  it('isLastLessonInUnit is true only for the last lesson of a unit', () => {
    for (const unit of curriculum) {
      unit.lessons.forEach((lesson, i) => {
        const expected = i === unit.lessons.length - 1;
        expect(isLastLessonInUnit(lesson.id, curriculum)).toBe(expected);
      });
    }
  });
});

describe('progression: review question selection', () => {
  it('returns no review questions for the first lesson of a unit', () => {
    for (const unit of curriculum) {
      const first = unit.lessons[0];
      expect(selectReviewQuestions(first.id, curriculum, 2)).toEqual([]);
    }
  });

  it('returns up to 2 review questions for later lessons, all from prior lessons in the same unit', () => {
    for (const unit of curriculum) {
      for (let i = 1; i < unit.lessons.length; i++) {
        const lesson = unit.lessons[i];
        const reviews = selectReviewQuestions(lesson.id, curriculum, 2);
        expect(reviews.length).toBeGreaterThan(0);
        expect(reviews.length).toBeLessThanOrEqual(2);
        const priorIds = unit.lessons.slice(0, i).map((l) => l.id);
        for (const r of reviews) {
          expect(priorIds).toContain(r.sourceLessonId);
        }
      }
    }
  });

  it('review question selection is deterministic across calls', () => {
    const unit = curriculum[0];
    if (unit.lessons.length < 2) return;
    const a = selectReviewQuestions(unit.lessons[1].id, curriculum, 2);
    const b = selectReviewQuestions(unit.lessons[1].id, curriculum, 2);
    expect(a.map((r) => `${r.sourceLessonId}:${r.sourceQuestionIndex}`)).toEqual(
      b.map((r) => `${r.sourceLessonId}:${r.sourceQuestionIndex}`),
    );
  });
});

describe('progression: mistake keys', () => {
  it('mistakeKey round-trips through resolveMistakeQuestion', () => {
    const unit = curriculum[0];
    const lesson = unit.lessons[0];
    const key = mistakeKey(lesson.id, 2);
    const resolved = resolveMistakeQuestion(key, curriculum);
    expect(resolved).not.toBeNull();
    expect(resolved!.lessonId).toBe(lesson.id);
    expect(resolved!.questionIndex).toBe(2);
    expect(resolved!.question).toBe(lesson.questions[2]);
  });

  it('resolveMistakeQuestion returns null for unknown keys', () => {
    expect(resolveMistakeQuestion('bogus:0', curriculum)).toBeNull();
    expect(resolveMistakeQuestion('malformed', curriculum)).toBeNull();
  });
});

describe('progression: unit review status', () => {
  it('is locked until every lesson of the unit is complete', () => {
    const unit = curriculum[0];
    const someDone = new Set<string>([unit.lessons[0].id]);
    expect(unitReviewStatus(unit.id, someDone, new Set(), curriculum)).toBe(
      'locked',
    );
  });

  it('is available when every lesson is complete and the review has not been done', () => {
    const unit = curriculum[0];
    const done = new Set(unit.lessons.map((l) => l.id));
    expect(unitReviewStatus(unit.id, done, new Set(), curriculum)).toBe(
      'available',
    );
  });

  it('is done once the unit review has been completed', () => {
    const unit = curriculum[0];
    const done = new Set(unit.lessons.map((l) => l.id));
    const reviews = new Set([unit.id]);
    expect(unitReviewStatus(unit.id, done, reviews, curriculum)).toBe('done');
  });
});
