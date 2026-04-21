export const DEFAULT_TIMER_DURATION = 60;
export const MIN_TIMER_DURATION = 30;
export const MAX_TIMER_DURATION = 120;

export const INITIAL_CARD_COUNT = 100;

export const TICK_START_SECONDS = 5;

export const ROUTES = {
  HOME: '/',
  TEAM_SETUP: '/setup',
  GAME: '/game',
  ADMIN: '/admin',
  END: '/end',
} as const;

export const STORAGE_KEY = 'alias-purim-game';

export const DEFAULT_TEAM_NAMES: [string, string] = ['קבוצה א׳', 'קבוצה ב׳'];

export const COLORS = {
  team1: {
    bg: 'bg-blue-600',
    bgHover: 'hover:bg-blue-700',
    text: 'text-blue-600',
    border: 'border-blue-600',
    ring: 'ring-blue-400',
  },
  team2: {
    bg: 'bg-white',
    bgHover: 'hover:bg-slate-100',
    text: 'text-blue-800',
    border: 'border-white',
    ring: 'ring-white',
  },
  correct: {
    bg: 'bg-emerald-500',
    bgHover: 'hover:bg-emerald-600',
  },
  skip: {
    bg: 'bg-rose-500',
    bgHover: 'hover:bg-rose-600',
  },
} as const;
