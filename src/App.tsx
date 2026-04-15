import { useState } from 'react';
import { Header } from './components/Header';
import { LessonPath } from './components/LessonPath';
import { LessonRunner } from './components/LessonRunner';
import { LessonComplete } from './components/LessonComplete';
import { curriculum } from './content';
import { flattenLessons } from './lib/progression';

type View =
  | { kind: 'home' }
  | { kind: 'lesson'; lessonId: string }
  | { kind: 'complete'; lessonId: string; xpAwarded: number };

export default function App() {
  const [view, setView] = useState<View>({ kind: 'home' });

  const flat = flattenLessons(curriculum);
  const findLesson = (id: string) => flat.find((l) => l.id === id)!;

  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6">
        {view.kind === 'home' && (
          <LessonPath
            onStart={(lessonId) => setView({ kind: 'lesson', lessonId })}
          />
        )}
        {view.kind === 'lesson' && (
          <LessonRunner
            lesson={findLesson(view.lessonId)}
            onDone={(xpAwarded) =>
              setView({
                kind: 'complete',
                lessonId: view.lessonId,
                xpAwarded,
              })
            }
            onQuit={() => setView({ kind: 'home' })}
          />
        )}
        {view.kind === 'complete' && (
          <LessonComplete
            xpAwarded={view.xpAwarded}
            onContinue={() => setView({ kind: 'home' })}
          />
        )}
      </main>
    </div>
  );
}
