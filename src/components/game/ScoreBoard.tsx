import { useGameStore } from '../../store/gameStore';

export function ScoreBoard() {
  const { teams, currentTeamIndex, usedCardIds, cards } = useGameStore();
  const remainingCards = cards.length - usedCardIds.length;

  return (
    <div className="bg-blue-950/60 backdrop-blur rounded-2xl p-4 border border-white/20">
      <div className="grid grid-cols-2 gap-4 mb-4">
        {teams.map((team, index) => (
          <div
            key={team.id}
            className={`
              rounded-xl p-4 text-center transition-all
              ${
                index === 0
                  ? 'bg-blue-600/40 border-2 border-blue-400'
                  : 'bg-white/80 border-2 border-white'
              }
              ${currentTeamIndex === index ? 'ring-4 ring-amber-300 scale-105' : ''}
            `}
          >
            <div className={`text-base mb-1 ${index === 0 ? 'text-sky-100' : 'text-blue-800'}`}>{team.name}</div>
            <div className={`text-4xl font-black ${index === 0 ? 'text-white' : 'text-blue-900'}`}>{team.score}</div>
            {currentTeamIndex === index && (
              <div className={`text-sm mt-1 animate-pulse ${index === 0 ? 'text-white/90' : 'text-blue-700'}`}>
                משחקים עכשיו
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center text-sky-200 text-base">
        נותרו {remainingCards} קלפים
      </div>
    </div>
  );
}
