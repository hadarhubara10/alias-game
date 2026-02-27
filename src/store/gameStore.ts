import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { GameState, GameStore, Card, Team } from './types';
import { GamePhase } from './types';
import { initialCards } from '../data/initialCards';
import { DEFAULT_TIMER_DURATION, STORAGE_KEY, DEFAULT_TEAM_NAMES } from '../consts';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const createInitialTeams = (): [Team, Team] => [
  { id: uuidv4(), name: DEFAULT_TEAM_NAMES[0], score: 0 },
  { id: uuidv4(), name: DEFAULT_TEAM_NAMES[1], score: 0 },
];

const getInitialState = (): GameState => ({
  cards: [...initialCards],
  usedCardIds: [],
  shuffledCardIds: shuffleArray(initialCards.map((c) => c.id)),
  phase: GamePhase.HOME,
  currentTeamIndex: 0,
  teams: createInitialTeams(),
  turnHistory: [],
  currentTurn: { correct: [], skipped: [] },
  currentCardId: null,
  stealCard: null,
  stealClaimed: false,
  timerDuration: DEFAULT_TIMER_DURATION,
});

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...getInitialState(),

      initializeGame: () => {
        set(getInitialState());
      },

      setTeamName: (teamIndex: 0 | 1, name: string) => {
        set((state) => {
          const teams = [...state.teams] as [Team, Team];
          teams[teamIndex] = { ...teams[teamIndex], name };
          return { teams };
        });
      },

      setTimerDuration: (duration: number) => {
        set({ timerDuration: duration });
      },

      startGame: () => {
        set({ phase: GamePhase.PLAYING });
        get().startTurn();
      },

      startTurn: () => {
        set({
          currentTurn: { correct: [], skipped: [] },
          stealCard: null,
          stealClaimed: false,
        });
        get().drawNextCard();
      },

      drawNextCard: () => {
        const state = get();
        const usedSet = new Set(state.usedCardIds);
        const availableIds = state.shuffledCardIds.filter((id) => !usedSet.has(id));

        if (availableIds.length === 0) {
          set({ currentCardId: null, phase: GamePhase.END });
          return null;
        }

        const nextId = availableIds[0];
        const card = state.cards.find((c) => c.id === nextId) || null;
        set({ currentCardId: nextId });
        return card;
      },

      markCorrect: () => {
        const state = get();
        if (!state.currentCardId) return;

        const card = state.cards.find((c) => c.id === state.currentCardId);
        if (!card) return;

        set((s) => {
          const teams = [...s.teams] as [Team, Team];
          teams[s.currentTeamIndex] = {
            ...teams[s.currentTeamIndex],
            score: teams[s.currentTeamIndex].score + 1,
          };
          return {
            usedCardIds: [...s.usedCardIds, s.currentCardId!],
            currentTurn: {
              ...s.currentTurn,
              correct: [...s.currentTurn.correct, card.word],
            },
            teams,
          };
        });

        get().drawNextCard();
      },

      markSkipped: () => {
        const state = get();
        if (!state.currentCardId) return;

        const card = state.cards.find((c) => c.id === state.currentCardId);
        if (!card) return;

        set((s) => {
          const teams = [...s.teams] as [Team, Team];
          teams[s.currentTeamIndex] = {
            ...teams[s.currentTeamIndex],
            score: teams[s.currentTeamIndex].score - 1,
          };
          return {
            usedCardIds: [...s.usedCardIds, s.currentCardId!],
            currentTurn: {
              ...s.currentTurn,
              skipped: [...s.currentTurn.skipped, card.word],
            },
            teams,
          };
        });

        get().drawNextCard();
      },

      endTurn: () => {
        const state = get();
        const remaining = get().getRemainingCards();

        if (remaining.length === 0) {
          const turnRecord = {
            teamId: state.teams[state.currentTeamIndex].id,
            correct: state.currentTurn.correct,
            skipped: state.currentTurn.skipped,
            stealWinnerId: null,
          };
          set((s) => ({
            turnHistory: [...s.turnHistory, turnRecord],
            phase: GamePhase.TURN_SUMMARY,
          }));
          return;
        }

        const stealCardId = state.shuffledCardIds.find(
          (id) => !state.usedCardIds.includes(id)
        );
        const stealCard = stealCardId
          ? state.cards.find((c) => c.id === stealCardId) || null
          : null;

        set({
          phase: GamePhase.STEAL,
          stealCard,
          stealClaimed: false,
          currentCardId: null,
        });
      },

      claimSteal: (teamIndex: 0 | 1) => {
        const state = get();
        if (state.stealClaimed || !state.stealCard) return;

        set((s) => {
          const teams = [...s.teams] as [Team, Team];
          teams[teamIndex] = {
            ...teams[teamIndex],
            score: teams[teamIndex].score + 1,
          };
          return {
            stealClaimed: true,
            usedCardIds: [...s.usedCardIds, s.stealCard!.id],
            teams,
          };
        });

        setTimeout(() => {
          const s = get();
          const turnRecord = {
            teamId: s.teams[s.currentTeamIndex].id,
            correct: s.currentTurn.correct,
            skipped: s.currentTurn.skipped,
            stealWinnerId: s.teams[teamIndex].id,
          };
          set((state) => ({
            turnHistory: [...state.turnHistory, turnRecord],
            phase: GamePhase.TURN_SUMMARY,
          }));
        }, 1000);
      },

      skipSteal: () => {
        const state = get();
        if (!state.stealCard) return;

        set((s) => ({
          usedCardIds: [...s.usedCardIds, s.stealCard!.id],
        }));

        const turnRecord = {
          teamId: state.teams[state.currentTeamIndex].id,
          correct: state.currentTurn.correct,
          skipped: state.currentTurn.skipped,
          stealWinnerId: null,
        };

        set((s) => ({
          turnHistory: [...s.turnHistory, turnRecord],
          phase: GamePhase.TURN_SUMMARY,
        }));
      },

      proceedFromSummary: () => {
        const state = get();
        const remaining = get().getRemainingCards();

        if (remaining.length === 0) {
          set({ phase: GamePhase.END });
          return;
        }

        const nextTeamIndex = state.currentTeamIndex === 0 ? 1 : 0;
        set({
          currentTeamIndex: nextTeamIndex as 0 | 1,
          phase: GamePhase.PLAYING,
        });
        get().startTurn();
      },

      newGame: () => {
        const state = get();
        set({
          phase: GamePhase.TEAM_SETUP,
          currentTeamIndex: 0,
          teams: [
            { ...state.teams[0], score: 0 },
            { ...state.teams[1], score: 0 },
          ],
          turnHistory: [],
          currentTurn: { correct: [], skipped: [] },
          currentCardId: null,
          stealCard: null,
          stealClaimed: false,
        });
      },

      fullReset: () => {
        const fresh = getInitialState();
        set({
          ...fresh,
          shuffledCardIds: shuffleArray(fresh.cards.map((c) => c.id)),
        });
      },

      addCard: (cardData) => {
        const newCard: Card = {
          id: uuidv4(),
          ...cardData,
        };
        set((state) => ({
          cards: [...state.cards, newCard],
          shuffledCardIds: [...state.shuffledCardIds, newCard.id],
        }));
      },

      updateCard: (id, updates) => {
        set((state) => ({
          cards: state.cards.map((card) =>
            card.id === id ? { ...card, ...updates } : card
          ),
        }));
      },

      deleteCard: (id) => {
        set((state) => ({
          cards: state.cards.filter((card) => card.id !== id),
          shuffledCardIds: state.shuffledCardIds.filter((cid) => cid !== id),
          usedCardIds: state.usedCardIds.filter((cid) => cid !== id),
        }));
      },

      importCards: (cards, mode) => {
        const cardsWithIds = cards.map((card) => ({
          ...card,
          id: card.id || uuidv4(),
        }));

        if (mode === 'replace') {
          set({
            cards: cardsWithIds,
            shuffledCardIds: shuffleArray(cardsWithIds.map((c) => c.id)),
            usedCardIds: [],
          });
        } else {
          set((state) => {
            const merged = [...state.cards, ...cardsWithIds];
            return {
              cards: merged,
              shuffledCardIds: [...state.shuffledCardIds, ...cardsWithIds.map((c) => c.id)],
            };
          });
        }
      },

      getRemainingCards: () => {
        const state = get();
        const usedSet = new Set(state.usedCardIds);
        return state.cards.filter((c) => !usedSet.has(c.id));
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        cards: state.cards,
        usedCardIds: state.usedCardIds,
        shuffledCardIds: state.shuffledCardIds,
        phase: state.phase,
        currentTeamIndex: state.currentTeamIndex,
        teams: state.teams,
        turnHistory: state.turnHistory,
        currentTurn: state.currentTurn,
        currentCardId: state.currentCardId,
        stealCard: state.stealCard,
        stealClaimed: state.stealClaimed,
        timerDuration: state.timerDuration,
      }),
    }
  )
);
