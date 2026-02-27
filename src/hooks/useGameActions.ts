import { useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import type { Card } from '../store/types';

export function useGameActions() {
  const store = useGameStore();

  const setTeamName = useCallback(
    (teamIndex: 0 | 1, name: string) => {
      store.setTeamName(teamIndex, name);
    },
    [store]
  );

  const setTimerDuration = useCallback(
    (duration: number) => {
      store.setTimerDuration(duration);
    },
    [store]
  );

  const startGame = useCallback(() => {
    store.startGame();
  }, [store]);

  const markCorrect = useCallback(() => {
    store.markCorrect();
  }, [store]);

  const markSkipped = useCallback(() => {
    store.markSkipped();
  }, [store]);

  const endTurn = useCallback(() => {
    store.endTurn();
  }, [store]);

  const claimSteal = useCallback(
    (teamIndex: 0 | 1) => {
      store.claimSteal(teamIndex);
    },
    [store]
  );

  const skipSteal = useCallback(() => {
    store.skipSteal();
  }, [store]);

  const proceedFromSummary = useCallback(() => {
    store.proceedFromSummary();
  }, [store]);

  const newGame = useCallback(() => {
    store.newGame();
  }, [store]);

  const fullReset = useCallback(() => {
    store.fullReset();
  }, [store]);

  const addCard = useCallback(
    (card: Omit<Card, 'id'>) => {
      store.addCard(card);
    },
    [store]
  );

  const updateCard = useCallback(
    (id: string, updates: Partial<Omit<Card, 'id'>>) => {
      store.updateCard(id, updates);
    },
    [store]
  );

  const deleteCard = useCallback(
    (id: string) => {
      store.deleteCard(id);
    },
    [store]
  );

  const importCards = useCallback(
    (cards: Card[], mode: 'replace' | 'append') => {
      store.importCards(cards, mode);
    },
    [store]
  );

  return {
    phase: store.phase,
    teams: store.teams,
    currentTeamIndex: store.currentTeamIndex,
    currentCardId: store.currentCardId,
    currentTurn: store.currentTurn,
    stealCard: store.stealCard,
    stealClaimed: store.stealClaimed,
    timerDuration: store.timerDuration,
    cards: store.cards,
    usedCardIds: store.usedCardIds,
    turnHistory: store.turnHistory,
    getRemainingCards: store.getRemainingCards,
    setTeamName,
    setTimerDuration,
    startGame,
    markCorrect,
    markSkipped,
    endTurn,
    claimSteal,
    skipSteal,
    proceedFromSummary,
    newGame,
    fullReset,
    addCard,
    updateCard,
    deleteCard,
    importCards,
  };
}
