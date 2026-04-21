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
      <div className="h-full bg-blue-950/80 backdrop-blur rounded-3xl flex items-center justify-center border-2 border-white/40">
        <p className="text-2xl text-sky-200">אין קלפים</p>
      </div>
    );
  }

  return (
    <div
      className={`
        h-full
        bg-gradient-to-br from-white to-sky-50
        rounded-3xl shadow-2xl border-4 border-blue-600
        overflow-hidden
        transition-opacity duration-150
        ${disabled ? 'opacity-60' : 'opacity-100'}
      `}
    >
      <div
        ref={containerRef}
        className="h-full w-full flex items-center justify-center p-8 relative"
      >
        <div className="absolute top-3 right-3 text-2xl opacity-60">✡️</div>
        <div className="absolute bottom-3 left-3 text-2xl opacity-60">✡️</div>
        <h2
          style={{ fontSize }}
          className="font-black text-blue-900 text-center leading-tight"
        >
          {word}
        </h2>
      </div>
    </div>
  );
}
