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
    bg: 'bg-purple-600',
    bgHover: 'hover:bg-purple-700',
    text: 'text-purple-600',
    border: 'border-purple-600',
    ring: 'ring-purple-400',
  },
  team2: {
    bg: 'bg-amber-500',
    bgHover: 'hover:bg-amber-600',
    text: 'text-amber-500',
    border: 'border-amber-500',
    ring: 'ring-amber-400',
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
