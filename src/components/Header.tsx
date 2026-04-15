import { useProgress } from '../store/progress';

export function Header() {
  const xp = useProgress((s) => s.xp);
  const reset = useProgress((s) => s.reset);

  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-brand-dark">System Design Quest</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-semibold text-slate-700">
            <span className="text-brand-dark">{xp}</span> XP
          </div>
          <button
            onClick={() => {
              if (confirm('Reset all progress? This cannot be undone.')) reset();
            }}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            reset
          </button>
        </div>
      </div>
    </header>
  );
}
