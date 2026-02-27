import { useGameStore } from '../../store/gameStore';
import { Button } from '../ui';
import { Badge } from '../ui';

interface TurnSummaryProps {
  onContinue: () => void;
}

export function TurnSummary({ onContinue }: TurnSummaryProps) {
  const { teams, currentTeamIndex, currentTurn, turnHistory, usedCardIds, cards } =
    useGameStore();

  const currentTeam = teams[currentTeamIndex];
  const lastTurn = turnHistory[turnHistory.length - 1];
  const remainingCards = cards.length - usedCardIds.length;

  const correctCount = currentTurn.correct.length;
  const skippedCount = currentTurn.skipped.length;
  const turnScore = correctCount - skippedCount;

  const stealWinner = lastTurn?.stealWinnerId
    ? teams.find((t) => t.id === lastTurn.stealWinnerId)
    : null;

  return (
    <div className="bg-slate-800/80 backdrop-blur rounded-3xl p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center text-white mb-6">
        סיכום תור - {currentTeam.name}
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-emerald-600/30 rounded-xl p-4 text-center">
          <div className="text-4xl font-black text-emerald-400">
            +{correctCount}
          </div>
          <div className="text-sm text-emerald-300">נכונות</div>
        </div>
        <div className="bg-rose-600/30 rounded-xl p-4 text-center">
          <div className="text-4xl font-black text-rose-400">
            -{skippedCount}
          </div>
          <div className="text-sm text-rose-300">דילוגים</div>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="text-lg text-slate-300">סה״כ לתור:</div>
        <div
          className={`text-5xl font-black ${
            turnScore >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}
        >
          {turnScore > 0 ? '+' : ''}
          {turnScore}
        </div>
      </div>

      {stealWinner && (
        <div className="bg-amber-600/30 rounded-xl p-3 mb-6 text-center">
          <Badge variant="warning" size="lg">
            גניבה: {stealWinner.name} +1
          </Badge>
        </div>
      )}

      {currentTurn.correct.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm text-slate-400 mb-2">מילים שנוחשו:</h3>
          <div className="flex flex-wrap gap-2">
            {currentTurn.correct.map((word, i) => (
              <Badge key={i} variant="success" size="sm">
                {word}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {currentTurn.skipped.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm text-slate-400 mb-2">מילים שדולגו:</h3>
          <div className="flex flex-wrap gap-2">
            {currentTurn.skipped.map((word, i) => (
              <Badge key={i} variant="danger" size="sm">
                {word}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-slate-700 pt-4 mb-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          {teams.map((team, index) => (
            <div key={team.id}>
              <div className="text-sm text-slate-400">{team.name}</div>
              <div
                className={`text-3xl font-bold ${
                  index === 0 ? 'text-purple-400' : 'text-amber-400'
                }`}
              >
                {team.score}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button variant="primary" size="lg" fullWidth onClick={onContinue}>
        {remainingCards === 0 ? 'לסיום המשחק' : 'לתור הבא'}
      </Button>
    </div>
  );
}
