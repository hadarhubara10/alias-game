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
              <h1 className="text-5xl font-black text-amber-400 mb-2">תיקו!</h1>
              <p className="text-xl text-slate-300">שתי הקבוצות שוות בנקודות</p>
            </>
          ) : (
            <>
              <h1 className="text-5xl font-black text-emerald-400 mb-2">
                🏆 {winner?.name} 🏆
              </h1>
              <p className="text-xl text-slate-300">ניצחו את המשחק!</p>
            </>
          )}
        </div>

        <div className="bg-slate-800/60 backdrop-blur rounded-3xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white text-center mb-4">
            תוצאות סופיות
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {teams.map((team, index) => (
              <div
                key={team.id}
                className={`
                  rounded-xl p-4 text-center
                  ${
                    index === 0
                      ? 'bg-purple-600/30 border-2 border-purple-500'
                      : 'bg-amber-500/30 border-2 border-amber-500'
                  }
                  ${winner?.id === team.id ? 'ring-4 ring-emerald-400' : ''}
                `}
              >
                <div className="text-lg text-slate-300 mb-1">{team.name}</div>
                <div className="text-5xl font-black text-white">{team.score}</div>
                {winner?.id === team.id && (
                  <Badge variant="success" size="sm">
                    מנצח
                  </Badge>
                )}
              </div>
            ))}
          </div>

          {turnHistory.length > 0 && (
            <div className="border-t border-slate-700 pt-4">
              <h3 className="text-sm text-slate-400 mb-3 text-center">
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
                      className="bg-slate-700/50 rounded-lg p-2 text-sm flex justify-between items-center"
                    >
                      <span className="text-slate-300">
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
