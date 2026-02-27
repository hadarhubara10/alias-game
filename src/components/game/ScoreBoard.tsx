import { useGameStore } from '../../store/gameStore';

export function ScoreBoard() {
  const { teams, currentTeamIndex, usedCardIds, cards } = useGameStore();
  const remainingCards = cards.length - usedCardIds.length;

  return (
    <div className="bg-slate-800/60 backdrop-blur rounded-2xl p-4">
      <div className="grid grid-cols-2 gap-4 mb-4">
        {teams.map((team, index) => (
          <div
            key={team.id}
            className={`
              rounded-xl p-4 text-center transition-all
              ${
                index === 0
                  ? 'bg-purple-600/30 border-2 border-purple-500'
                  : 'bg-amber-500/30 border-2 border-amber-500'
              }
              ${currentTeamIndex === index ? 'ring-4 ring-white/50 scale-105' : ''}
            `}
          >
            <div className="text-base text-slate-300 mb-1">{team.name}</div>
            <div className="text-4xl font-black text-white">{team.score}</div>
            {currentTeamIndex === index && (
              <div className="text-sm text-white/80 mt-1 animate-pulse">
                משחקים עכשיו
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center text-slate-400 text-base">
        נותרו {remainingCards} קלפים
      </div>
    </div>
  );
}
