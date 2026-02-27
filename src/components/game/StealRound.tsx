import { useGameStore } from '../../store/gameStore';
import { useFitText } from '../../hooks/useFitText';

export function StealCardDisplay() {
  const { stealCard } = useGameStore();
  const { containerRef, fontSize } = useFitText(stealCard?.word ?? '');

  if (!stealCard) return null;

  return (
    <div className="h-full bg-gradient-to-br from-amber-900/40 to-slate-900 rounded-3xl shadow-2xl border-2 border-amber-500 overflow-hidden">
      <div
        ref={containerRef}
        className="h-full w-full flex items-center justify-center p-8"
      >
        <h2
          style={{ fontSize }}
          className="font-black text-white text-center leading-tight"
        >
          {stealCard.word}
        </h2>
      </div>
    </div>
  );
}
