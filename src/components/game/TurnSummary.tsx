import { useGameStore } from '../../store/gameStore';
import { Button, Badge } from '../ui';

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
    <div className="h-full flex flex-col gap-3 overflow-hidden">

      {/* Header */}
      <div className="shrink-0 text-center">
        <h2 className="text-2xl font-bold text-white">
          סיכום תור — {currentTeam.name}
        </h2>
      </div>

      {/* Correct / Skip counts */}
      <div className="grid grid-cols-2 gap-3 shrink-0">
        <div className="bg-emerald-600/30 rounded-2xl p-4 text-center">
          <div className="text-5xl font-black text-emerald-400">+{correctCount}</div>
          <div className="text-base text-emerald-300 mt-1">נכונות</div>
        </div>
        <div className="bg-rose-600/30 rounded-2xl p-4 text-center">
          <div className="text-5xl font-black text-rose-400">-{skippedCount}</div>
          <div className="text-base text-rose-300 mt-1">דילוגים</div>
        </div>
      </div>

      {/* Turn total */}
      <div className="shrink-0 text-center bg-slate-800/60 rounded-2xl py-3">
        <div className="text-slate-400 text-base">סה״כ לתור</div>
        <div
          className={`text-5xl font-black ${turnScore >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
        >
          {turnScore > 0 ? '+' : ''}{turnScore}
        </div>
      </div>

      {/* Steal winner */}
      {stealWinner && (
        <div className="shrink-0 bg-amber-600/30 rounded-2xl p-3 text-center">
          <Badge variant="warning" size="lg">
            גניבה: {stealWinner.name} +1
          </Badge>
        </div>
      )}

      {/* Word lists — scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-3">
        {currentTurn.correct.length > 0 && (
          <div className="bg-slate-800/40 rounded-2xl p-4">
            <h3 className="text-base font-semibold text-slate-300 mb-3">✅ מילים שנוחשו</h3>
            <div className="flex flex-wrap gap-2">
              {currentTurn.correct.map((word, i) => (
                <Badge key={i} variant="success" size="md">{word}</Badge>
              ))}
            </div>
          </div>
        )}

        {currentTurn.skipped.length > 0 && (
          <div className="bg-slate-800/40 rounded-2xl p-4">
            <h3 className="text-base font-semibold text-slate-300 mb-3">⏭️ מילים שדולגו</h3>
            <div className="flex flex-wrap gap-2">
              {currentTurn.skipped.map((word, i) => (
                <Badge key={i} variant="danger" size="md">{word}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Scoreboard */}
      <div className="shrink-0 grid grid-cols-2 gap-3">
        {teams.map((team, index) => (
          <div
            key={team.id}
            className={`rounded-2xl p-3 text-center ${index === 0
              ? 'bg-purple-600/30 border border-purple-500'
              : 'bg-amber-500/30 border border-amber-500'
              }`}
          >
            <div className="text-base text-slate-300 font-medium">{team.name}</div>
            <div
              className={`text-6xl font-black ${index === 0 ? 'text-purple-400' : 'text-amber-400'
                }`}
            >
              {team.score}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Button
        variant="primary"
        size="xl"
        fullWidth
        onClick={onContinue}
        className="shrink-0 h-16 text-xl"
      >
        {remainingCards === 0 ? '🏆 לסיום המשחק' : 'לתור הבא ← '}
      </Button>

    </div>
  );
}
