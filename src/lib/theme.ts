import { useEffect } from 'react';
import { useProgress, type Theme } from '../store/progress';

const PREFERS_DARK = '(prefers-color-scheme: dark)';

function systemPrefersDark(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(PREFERS_DARK).matches;
}

export function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') return systemPrefersDark() ? 'dark' : 'light';
  return theme;
}

function applyThemeClass(mode: 'light' | 'dark') {
  const root = document.documentElement;
  if (mode === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
}

/**
 * Mount once at the App root. Applies the current theme to <html> and keeps
 * it in sync with the user's choice plus (if 'system') the OS preference.
 */
export function useTheme() {
  const theme = useProgress((s) => s.theme);

  useEffect(() => {
    applyThemeClass(resolveTheme(theme));
    if (theme !== 'system') return;

    const mql = window.matchMedia(PREFERS_DARK);
    const onChange = () => applyThemeClass(systemPrefersDark() ? 'dark' : 'light');
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [theme]);
}
