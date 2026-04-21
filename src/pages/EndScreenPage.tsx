import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { Button, Badge } from '../components/ui';
import { ROUTES } from '../consts';

export function EndScreenPage() {
  const navigate = useNavigate();
  const { teams, turnHistory, newGame, fullReset } = useGameStore();

  const winner =
    teams[0].score > teams[1].score
      ? teams[0]
      : teams[1].score > teams[0].score
      ? teams[1]
      : null;

  const isTie = teams[0].score === teams[1].score;

  const handleNewGame = () => {
    newGame();
    navigate(ROUTES.TEAM_SETUP);
  };

  const handleFullReset = () => {
    if (
      window.confirm(
        'האם לאפס את כל הקלפים? פעולה זו תחזיר את כל 100 הקלפים למשחק.'
      )
    ) {
      fullReset();
      navigate(ROUTES.HOME);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          {isTie ? (
            <>
              <div className="text-4xl mb-2">🇮🇱 🎆 🇮🇱</div>
              <h1 className="text-5xl font-black text-amber-300 mb-2">תיקו!</h1>
              <p className="text-xl text-sky-100">שתי הקבוצות שוות בנקודות</p>
            </>
          ) : (
            <>
              <div className="text-4xl mb-2">🎆 🎇 🎆</div>
              <h1 className="text-5xl font-black text-amber-300 mb-2">
                🏆 {winner?.name} 🏆
              </h1>
              <p className="text-xl text-sky-100">ניצחו את המשחק!</p>
            </>
          )}
        </div>

        <div className="bg-blue-950/60 backdrop-blur rounded-3xl p-6 mb-6 border-2 border-white/30">
          <h2 className="text-xl font-bold text-white text-center mb-4">
            ✡️ תוצאות סופיות ✡️
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {teams.map((team, index) => (
              <div
                key={team.id}
                className={`
                  rounded-xl p-4 text-center
                  ${
                    index === 0
                      ? 'bg-blue-600/40 border-2 border-blue-400'
                      : 'bg-white/80 border-2 border-white'
                  }
                  ${winner?.id === team.id ? 'ring-4 ring-amber-300' : ''}
                `}
              >
                <div className={`text-lg mb-1 ${index === 0 ? 'text-sky-100' : 'text-blue-800'}`}>{team.name}</div>
                <div className={`text-5xl font-black ${index === 0 ? 'text-white' : 'text-blue-900'}`}>{team.score}</div>
                {winner?.id === team.id && (
                  <Badge variant="success" size="sm">
                    מנצח
                  </Badge>
                )}
              </div>
            ))}
          </div>

          {turnHistory.length > 0 && (
            <div className="border-t border-white/20 pt-4">
              <h3 className="text-base text-sky-200 mb-3 text-center">
                סיכום תורות
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {turnHistory.map((turn, index) => {
                  const team = teams.find((t) => t.id === turn.teamId);
                  const stealWinner = turn.stealWinnerId
                    ? teams.find((t) => t.id === turn.stealWinnerId)
                    : null;
                  return (
                    <div
                      key={index}
                      className="bg-blue-900/50 rounded-lg p-2 text-base flex justify-between items-center border border-white/10"
                    >
                      <span className="text-sky-100">
                        תור {index + 1}: {team?.name}
                      </span>
                      <div className="flex gap-2">
                        <Badge variant="success" size="sm">
                          +{turn.correct.length}
                        </Badge>
                        <Badge variant="danger" size="sm">
                          -{turn.skipped.length}
                        </Badge>
                        {stealWinner && (
                          <Badge variant="warning" size="sm">
                            גניבה: {stealWinner.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Button variant="primary" size="xl" fullWidth onClick={handleNewGame}>
            משחק חדש (אותם קלפים)
          </Button>
          <Button variant="danger" size="lg" fullWidth onClick={handleFullReset}>
            איפוס מלא (כל הקלפים)
          </Button>
          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={() => navigate(ROUTES.HOME)}
          >
            לדף הבית
          </Button>
        </div>
      </div>
    </div>
  );
}
