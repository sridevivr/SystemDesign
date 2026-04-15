import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ProgressState = {
  xp: number;
  completed: string[]; // stored as array so it JSON-persists cleanly
  completeLesson: (lessonId: string, xpAwarded: number) => void;
  reset: () => void;
};

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      xp: 0,
      completed: [],
      completeLesson: (lessonId, xpAwarded) => {
        if (get().completed.includes(lessonId)) return; // idempotent
        set({
          completed: [...get().completed, lessonId],
          xp: get().xp + xpAwarded,
        });
      },
      reset: () => set({ xp: 0, completed: [] }),
    }),
    { name: 'sdq.progress.v1' },
  ),
);

// Convenience: turn the stored array into a Set for progression lookups.
export function useCompletedSet(): Set<string> {
  const completed = useProgress((s) => s.completed);
  return new Set(completed);
}
