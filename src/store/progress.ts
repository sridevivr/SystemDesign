import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ProgressState = {
  xp: number;
  completed: string[]; // lessonIds, in completion order
  completedReviews: string[]; // unitIds whose end-of-unit review is done
  // Per-unit bucket of mistake keys (format: `${lessonId}:${questionIndex}`).
  // Accumulated as you play lessons; drained when you complete the unit review.
  mistakes: Record<string, string[]>;

  completeLesson: (
    lessonId: string,
    xpAwarded: number,
    unitId: string,
    wrongKeys: string[],
  ) => void;
  completeUnitReview: (unitId: string, xpAwarded: number) => void;
  reset: () => void;
};

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      xp: 0,
      completed: [],
      completedReviews: [],
      mistakes: {},

      completeLesson: (lessonId, xpAwarded, unitId, wrongKeys) => {
        const state = get();
        const isNewCompletion = !state.completed.includes(lessonId);
        const existing = state.mistakes[unitId] ?? [];
        const merged = Array.from(new Set([...existing, ...wrongKeys]));
        const nextMistakes = { ...state.mistakes, [unitId]: merged };
        set({
          completed: isNewCompletion
            ? [...state.completed, lessonId]
            : state.completed,
          xp: isNewCompletion ? state.xp + xpAwarded : state.xp,
          mistakes: nextMistakes,
        });
      },

      completeUnitReview: (unitId, xpAwarded) => {
        const state = get();
        const isNew = !state.completedReviews.includes(unitId);
        const nextMistakes = { ...state.mistakes };
        delete nextMistakes[unitId];
        set({
          completedReviews: isNew
            ? [...state.completedReviews, unitId]
            : state.completedReviews,
          xp: isNew ? state.xp + xpAwarded : state.xp,
          mistakes: nextMistakes,
        });
      },

      reset: () =>
        set({ xp: 0, completed: [], completedReviews: [], mistakes: {} }),
    }),
    { name: 'sdq.progress.v1' },
  ),
);

export function useCompletedSet(): Set<string> {
  const completed = useProgress((s) => s.completed);
  return new Set(completed);
}

export function useCompletedReviewsSet(): Set<string> {
  const completedReviews = useProgress((s) => s.completedReviews);
  return new Set(completedReviews);
}
