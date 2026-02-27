import { useMemo } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Button } from '../ui';

interface CardDisplayProps {
  onCorrect: () => void;
  onSkip: () => void;
  disabled?: boolean;
}

export function CardDisplay({ onCorrect, onSkip, disabled = false }: CardDisplayProps) {
  const { cards, currentCardId } = useGameStore();

  const currentCard = useMemo(() => {
    if (!currentCardId) return null;
    return cards.find((c) => c.id === currentCardId) || null;
  }, [cards, currentCardId]);

  if (!currentCard) {
    return (
      <div className="bg-slate-800/80 backdrop-blur rounded-3xl p-8 text-center">
        <p className="text-2xl text-slate-400">אין קלפים</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700">
        <div className="text-center">
          <h2 className="text-5xl md:text-6xl font-black text-white leading-tight">
            {currentCard.word}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="success"
          size="xl"
          onClick={onCorrect}
          disabled={disabled}
          className="py-6 text-2xl"
        >
          נכון ✓
        </Button>
        <Button
          variant="danger"
          size="xl"
          onClick={onSkip}
          disabled={disabled}
          className="py-6 text-2xl"
        >
          דלג ✗
        </Button>
      </div>
    </div>
  );
}
