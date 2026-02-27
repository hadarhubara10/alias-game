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
    if (window.confirm('האם לאפס את כל הקלפים והנתונים? פעולה זו לא ניתנת לביטול.')) {
      fullReset();
    }
  };

  const canContinue =
    phase === GamePhase.PLAYING ||
    phase === GamePhase.STEAL ||
    phase === GamePhase.TURN_SUMMARY;

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden p-5 gap-4">

      {/* Title */}
      <div className="shrink-0 text-center pt-4">
        <h1 className="text-6xl font-black text-white drop-shadow-lg">אליאס</h1>
        <h2 className="text-2xl font-bold text-purple-300 mt-1">מהדורת פורים 🎭</h2>
      </div>

      {/* Description + card count */}
      <div className="shrink-0 bg-slate-800/60 backdrop-blur rounded-2xl p-4 text-center">
        <p className="text-slate-300">
          תסבירו מילים בלי להשתמש במילה עצמה!
        </p>
        {hasUsedCards && (
          <p className="text-sm text-slate-400 mt-2">
            נותרו{' '}
            <span className="text-white font-bold">{remainingCards}</span>{' '}
            קלפים מתוך{' '}
            <span className="text-white font-bold">{cards.length}</span>
          </p>
        )}
      </div>

      {/* Main buttons — fill remaining space */}
      <div className="flex-1 min-h-0 flex flex-col gap-3">
        {canContinue && (
          <Button
            variant="success"
            size="xl"
            fullWidth
            onClick={handleContinueGame}
            className="flex-1 text-2xl"
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
          className="flex-1 text-2xl"
        >
          {hasUsedCards ? 'משחק חדש' : 'התחל משחק'}
        </Button>

        {hasUsedCards && (
          <Button
            variant="danger"
            size="xl"
            fullWidth
            onClick={handleFullReset}
            className="flex-1 text-xl"
          >
            איפוס מלא (כל הקלפים)
          </Button>
        )}
      </div>

      {/* Admin — always at bottom */}
      <Button
        variant="secondary"
        size="lg"
        fullWidth
        onClick={() => navigate(ROUTES.ADMIN)}
        className="shrink-0"
      >
        ניהול קלפים
      </Button>

    </div>
  );
}
