import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import { useGameStore } from '../store/gameStore';
import { GamePhase } from '../store/types';
import { ROUTES } from '../consts';

export function HomePage() {
  const navigate = useNavigate();
  const { phase, fullReset, usedCardIds, cards } = useGameStore();
  const remainingCards = cards.length - usedCardIds.length;
  const hasUsedCards = usedCardIds.length > 0;

  const handleStartGame = () => {
    useGameStore.setState({ phase: GamePhase.TEAM_SETUP });
    navigate(ROUTES.TEAM_SETUP);
  };

  const handleContinueGame = () => {
    navigate(ROUTES.GAME);
  };

  const handleFullReset = () => {
    if (
      window.confirm(
        'האם לאפס את כל הקלפים והנתונים? פעולה זו לא ניתנת לביטול.'
      )
    ) {
      fullReset();
    }
  };

  const canContinue = phase === GamePhase.PLAYING || phase === GamePhase.STEAL || phase === GamePhase.TURN_SUMMARY;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-black text-white mb-2 drop-shadow-lg">
            אליאס
          </h1>
          <h2 className="text-3xl font-bold text-purple-300">
            מהדורת פורים 🎭
          </h2>
        </div>

        <div className="bg-slate-800/60 backdrop-blur rounded-3xl p-6 mb-6">
          <p className="text-slate-300 mb-4">
            תסבירו מילים בלי להשתמש במילה עצמה!
            <br />
            המשחק המושלם למסיבת פורים
          </p>

          {hasUsedCards && (
            <div className="bg-slate-700/50 rounded-xl p-3 mb-4">
              <p className="text-sm text-slate-400">
                נותרו <span className="text-white font-bold">{remainingCards}</span> קלפים
                מתוך <span className="text-white font-bold">{cards.length}</span>
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {canContinue && (
              <Button
                variant="success"
                size="xl"
                fullWidth
                onClick={handleContinueGame}
              >
                המשך משחק
              </Button>
            )}

            <Button
              variant="primary"
              size="xl"
              fullWidth
              onClick={handleStartGame}
              disabled={remainingCards === 0}
            >
              {hasUsedCards ? 'משחק חדש' : 'התחל משחק'}
            </Button>

            {hasUsedCards && (
              <Button
                variant="danger"
                size="lg"
                fullWidth
                onClick={handleFullReset}
              >
                איפוס מלא (כל הקלפים)
              </Button>
            )}
          </div>
        </div>

        <Button
          variant="secondary"
          size="md"
          onClick={() => navigate(ROUTES.ADMIN)}
        >
          ניהול קלפים
        </Button>
      </div>
    </div>
  );
}
