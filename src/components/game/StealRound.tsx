import { useGameStore } from '../../store/gameStore';
import { Button } from '../ui';

interface StealRoundProps {
  onClaim: (teamIndex: 0 | 1) => void;
  onSkip: () => void;
}

export function StealRound({ onClaim, onSkip }: StealRoundProps) {
  const { stealCard, stealClaimed, teams } = useGameStore();

  if (!stealCard) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-amber-400 animate-pulse">
          סיבוב גניבה!
        </h2>
        <p className="text-slate-300 mt-2">
          מי מנחש ראשון את המילה?
        </p>
      </div>

      <div className="bg-gradient-to-br from-amber-900/50 to-slate-900 rounded-3xl p-8 shadow-2xl border-2 border-amber-500">
        <div className="text-center">
          <h2 className="text-5xl md:text-6xl font-black text-white leading-tight">
            {stealCard.word}
          </h2>
        </div>
      </div>

      {stealClaimed ? (
        <div className="text-center text-2xl text-emerald-400 font-bold animate-bounce">
          נגנב!
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="team1"
              size="xl"
              onClick={() => onClaim(0)}
              className="py-8 text-xl"
            >
              {teams[0].name}
              <br />
              <span className="text-3xl">🔔</span>
            </Button>
            <Button
              variant="team2"
              size="xl"
              onClick={() => onClaim(1)}
              className="py-8 text-xl"
            >
              {teams[1].name}
              <br />
              <span className="text-3xl">🔔</span>
            </Button>
          </div>

          <Button
            variant="secondary"
            size="lg"
            onClick={onSkip}
            className="mt-2"
          >
            אף אחד לא ידע - דלג
          </Button>
        </>
      )}
    </div>
  );
}
