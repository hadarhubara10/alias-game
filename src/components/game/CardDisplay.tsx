import { useMemo } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useFitText } from '../../hooks/useFitText';

interface CardDisplayProps {
  disabled?: boolean;
}

export function CardDisplay({ disabled = false }: CardDisplayProps) {
  const { cards, currentCardId } = useGameStore();

  const currentCard = useMemo(() => {
    if (!currentCardId) return null;
    return cards.find((c) => c.id === currentCardId) || null;
  }, [cards, currentCardId]);

  const word = currentCard?.word ?? '';
  const { containerRef, fontSize } = useFitText(word);

  if (!currentCard) {
    return (
      <div className="h-full bg-slate-800/80 backdrop-blur rounded-3xl flex items-center justify-center">
        <p className="text-2xl text-slate-400">אין קלפים</p>
      </div>
    );
  }

  return (
    <div
      className={`
        h-full
        bg-gradient-to-br from-slate-800 to-slate-900
        rounded-3xl shadow-2xl border border-slate-700
        overflow-hidden
        transition-opacity duration-150
        ${disabled ? 'opacity-60' : 'opacity-100'}
      `}
    >
      <div
        ref={containerRef}
        className="h-full w-full flex items-center justify-center p-8"
      >
        <h2
          style={{ fontSize }}
          className="font-black text-white text-center leading-tight"
        >
          {word}
        </h2>
      </div>
    </div>
  );
}
