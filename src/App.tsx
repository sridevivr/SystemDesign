import { useState } from 'react';
import { Header } from './components/Header';
import { LessonPath } from './components/LessonPath';
import { LessonRunner } from './components/LessonRunner';
import { LessonComplete } from './components/LessonComplete';
import { UnitReviewRunner } from './components/UnitReviewRunner';
import { UnitComplete } from './components/UnitComplete';
import { curriculum } from './content';
import { flattenLessons } from './lib/progression';

type View =
  | { kind: 'home' }
  | { kind: 'lesson'; lessonId: string }
  | {
      kind: 'lesson-complete';
      xpAwarded: number;
      goToUnitReview: string | null;
    }
  | { kind: 'unit-review'; unitId: string }
  | { kind: 'unit-complete'; unitId: string; xpAwarded: number };

export default function App() {
  const [view, setView] = useState<View>({ kind: 'home' });

  const flat = flattenLessons(curriculum);
  const findLesson = (id: string) => flat.find((l) => l.id === id)!;
  const findUnit = (id: string) => curriculum.find((u) => u.id === id)!;

  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6">
        {view.kind === 'home' && (
          <LessonPath
            onStart={(lessonId) => setView({ kind: 'lesson', lessonId })}
            onStartReview={(unitId) => setView({ kind: 'unit-review', unitId })}
          />
        )}

        {view.kind === 'lesson' && (
          <LessonRunner
            lesson={findLesson(view.lessonId)}
            onDone={({ xpAwarded, wasLastInUnit, unitId }) =>
              setView({
                kind: 'lesson-complete',
                xpAwarded,
                goToUnitReview: wasLastInUnit ? unitId : null,
              })
            }
            onQuit={() => setView({ kind: 'home' })}
          />
        )}

        {view.kind === 'lesson-complete' && (
          <LessonComplete
            xpAwarded={view.xpAwarded}
            nextAction={view.goToUnitReview ? 'unit-review' : 'home'}
            onContinue={() => {
              if (view.goToUnitReview) {
                setView({ kind: 'unit-review', unitId: view.goToUnitReview });
              } else {
                setView({ kind: 'home' });
              }
            }}
          />
        )}

        {view.kind === 'unit-review' && (
          <UnitReviewRunner
            unitId={view.unitId}
            onDone={(xpAwarded) =>
              setView({
                kind: 'unit-complete',
                unitId: view.unitId,
                xpAwarded,
              })
            }
            onQuit={() => setView({ kind: 'home' })}
          />
        )}

        {view.kind === 'unit-complete' && (
          <UnitComplete
            unitTitle={findUnit(view.unitId).title}
            xpAwarded={view.xpAwarded}
            onContinue={() => setView({ kind: 'home' })}
          />
        )}
      </main>
    </div>
  );
}
