// Map from unit id to a bundle of Tailwind class strings for that unit's
// accent color. Full class names are listed here (not interpolated) so
// Tailwind's JIT scanner picks them up at build time.
//
// Playful-but-adult palette: each unit gets a distinct, cheerful hue while
// the overall app chrome stays indigo.

export type UnitAccent = {
  /** short human color name, for debugging / aria-labels */
  name: string;

  /** CSS hex, useful for inline SVG `stroke` / `fill` etc. */
  hex: string;
  hexDark: string;

  /** solid fill, e.g. primary node background */
  bg: string;
  /** light fill, e.g. card tint */
  bgSoft: string;
  /** border for outlined variants */
  border: string;
  /** text color */
  text: string;
  /** ring (used for 'current lesson' halo) */
  ring: string;
  /** dark-mode variants: apply to the same element alongside the light ones */
  darkBg: string;
  darkBgSoft: string;
  darkBorder: string;
  darkText: string;
  darkRing: string;
};

const UNIT_ACCENTS: Record<string, UnitAccent> = {
  foundations: {
    name: 'sky',
    hex: '#0ea5e9',
    hexDark: '#38bdf8',
    bg: 'bg-sky-500',
    bgSoft: 'bg-sky-50',
    border: 'border-sky-400',
    text: 'text-sky-600',
    ring: 'ring-sky-300',
    darkBg: 'dark:bg-sky-500',
    darkBgSoft: 'dark:bg-sky-500/10',
    darkBorder: 'dark:border-sky-400/50',
    darkText: 'dark:text-sky-300',
    darkRing: 'dark:ring-sky-500/40',
  },
  networking: {
    name: 'violet',
    hex: '#8b5cf6',
    hexDark: '#a78bfa',
    bg: 'bg-violet-500',
    bgSoft: 'bg-violet-50',
    border: 'border-violet-400',
    text: 'text-violet-600',
    ring: 'ring-violet-300',
    darkBg: 'dark:bg-violet-500',
    darkBgSoft: 'dark:bg-violet-500/10',
    darkBorder: 'dark:border-violet-400/50',
    darkText: 'dark:text-violet-300',
    darkRing: 'dark:ring-violet-500/40',
  },
  scaling: {
    name: 'amber',
    hex: '#f59e0b',
    hexDark: '#fbbf24',
    bg: 'bg-amber-500',
    bgSoft: 'bg-amber-50',
    border: 'border-amber-400',
    text: 'text-amber-600',
    ring: 'ring-amber-300',
    darkBg: 'dark:bg-amber-500',
    darkBgSoft: 'dark:bg-amber-500/10',
    darkBorder: 'dark:border-amber-400/50',
    darkText: 'dark:text-amber-300',
    darkRing: 'dark:ring-amber-500/40',
  },
  databases: {
    name: 'teal',
    hex: '#14b8a6',
    hexDark: '#2dd4bf',
    bg: 'bg-teal-500',
    bgSoft: 'bg-teal-50',
    border: 'border-teal-400',
    text: 'text-teal-600',
    ring: 'ring-teal-300',
    darkBg: 'dark:bg-teal-500',
    darkBgSoft: 'dark:bg-teal-500/10',
    darkBorder: 'dark:border-teal-400/50',
    darkText: 'dark:text-teal-300',
    darkRing: 'dark:ring-teal-500/40',
  },
  caching: {
    name: 'pink',
    hex: '#ec4899',
    hexDark: '#f472b6',
    bg: 'bg-pink-500',
    bgSoft: 'bg-pink-50',
    border: 'border-pink-400',
    text: 'text-pink-600',
    ring: 'ring-pink-300',
    darkBg: 'dark:bg-pink-500',
    darkBgSoft: 'dark:bg-pink-500/10',
    darkBorder: 'dark:border-pink-400/50',
    darkText: 'dark:text-pink-300',
    darkRing: 'dark:ring-pink-500/40',
  },
};

// Default accent for anything that can't be mapped (e.g. future units we
// haven't assigned a colour for yet).
const DEFAULT_ACCENT: UnitAccent = {
  name: 'indigo',
  hex: '#6366f1',
  hexDark: '#818cf8',
  bg: 'bg-indigo-500',
  bgSoft: 'bg-indigo-50',
  border: 'border-indigo-400',
  text: 'text-indigo-600',
  ring: 'ring-indigo-300',
  darkBg: 'dark:bg-indigo-500',
  darkBgSoft: 'dark:bg-indigo-500/10',
  darkBorder: 'dark:border-indigo-400/50',
  darkText: 'dark:text-indigo-300',
  darkRing: 'dark:ring-indigo-500/40',
};

export function unitAccent(unitId: string): UnitAccent {
  return UNIT_ACCENTS[unitId] ?? DEFAULT_ACCENT;
}

/**
 * Resolve the accent colour for a lesson by walking the curriculum to find
 * which unit owns it. Used so review badges / diagrams can pull the colour
 * of their source unit regardless of where they are being rendered.
 */
import type { Unit } from '../content/types';
export function lessonAccent(lessonId: string, curriculum: Unit[]): UnitAccent {
  const unit = curriculum.find((u) => u.lessons.some((l) => l.id === lessonId));
  return unit ? unitAccent(unit.id) : DEFAULT_ACCENT;
}
