import { useGameStore } from '../../store/gameStore';
import { useFitText } from '../../hooks/useFitText';

export function StealCardDisplay() {
  const { stealCard } = useGameStore();
  const { containerRef, fontSize } = useFitText(stealCard?.word ?? '');

  if (!stealCard) return null;

  return (
    <div className="h-full bg-gradient-to-br from-amber-200 to-amber-400 rounded-3xl shadow-2xl border-4 border-amber-500 overflow-hidden relative">
      <div className="absolute top-3 right-3 text-2xl">🎆</div>
      <div className="absolute top-3 left-3 text-2xl">🎇</div>
      <div className="absolute bottom-3 right-3 text-2xl">🎇</div>
      <div className="absolute bottom-3 left-3 text-2xl">🎆</div>
      <div
        ref={containerRef}
        className="h-full w-full flex items-center justify-center p-8"
      >
        <h2
          style={{ fontSize }}
          className="font-black text-blue-900 text-center leading-tight"
        >
          {stealCard.word}
        </h2>
      </div>
    </div>
  );
}
