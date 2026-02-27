export const GamePhase = {
  HOME: 'HOME',
  TEAM_SETUP: 'TEAM_SETUP',
  PLAYING: 'PLAYING',
  STEAL: 'STEAL',
  TURN_SUMMARY: 'TURN_SUMMARY',
  END: 'END',
} as const;

export type GamePhase = (typeof GamePhase)[keyof typeof GamePhase];

export interface Card {
  id: string;
  word: string;
}

export interface Team {
  id: string;
  name: string;
  score: number;
}

export interface TurnRecord {
  teamId: string;
  correct: string[];
  skipped: string[];
  stealWinnerId: string | null;
}

export interface CurrentTurn {
  correct: string[];
  skipped: string[];
}

export interface GameState {
  cards: Card[];
  usedCardIds: string[];
  shuffledCardIds: string[];
  phase: GamePhase;
  currentTeamIndex: 0 | 1;
  teams: [Team, Team];
  turnHistory: TurnRecord[];
  currentTurn: CurrentTurn;
  currentCardId: string | null;
  stealCard: Card | null;
  stealClaimed: boolean;
  timerDuration: number;
}

export interface GameActions {
  initializeGame: () => void;
  setTeamName: (teamIndex: 0 | 1, name: string) => void;
  setTimerDuration: (duration: number) => void;
  startGame: () => void;
  startTurn: () => void;
  drawNextCard: () => Card | null;
  markCorrect: () => void;
  markSkipped: () => void;
  endTurn: () => void;
  claimSteal: (teamIndex: 0 | 1) => void;
  skipSteal: () => void;
  proceedFromSummary: () => void;
  newGame: () => void;
  fullReset: () => void;
  addCard: (card: Omit<Card, 'id'>) => void;
  updateCard: (id: string, updates: Partial<Omit<Card, 'id'>>) => void;
  deleteCard: (id: string) => void;
  importCards: (cards: Card[], mode: 'replace' | 'append') => void;
  getRemainingCards: () => Card[];
}

export type GameStore = GameState & GameActions;
