import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { GamePhase } from '../store/types';
import { useTimer } from '../hooks/useTimer';
import { useAudio } from '../hooks/useAudio';
import { CardDisplay, ScoreBoard, StealCardDisplay, TurnSummary, Timer } from '../components/game';
import { Button } from '../components/ui';
import { ROUTES, TICK_START_SECONDS } from '../consts';

export function GameBoardPage() {
  const navigate = useNavigate();
  const {
    phase,
    timerDuration,
    teams,
    stealClaimed,
    markCorrect,
    markSkipped,
    endTurn,
    claimSteal,
    skipSteal,
    proceedFromSummary,
  } = useGameStore();

  const { playTick, playTurnEnd, playCorrect, playBuzz } = useAudio();

  const handleTimerComplete = useCallback(() => {
    playTurnEnd();
    endTurn();
  }, [playTurnEnd, endTurn]);

  const handleTick = useCallback(
    (secondsLeft: number) => {
      if (secondsLeft <= TICK_START_SECONDS && secondsLeft > 0) {
        playTick();
      }
    },
    [playTick]
  );

  const { secondsLeft, isRunning, restart, pause } = useTimer({
    initialTime: timerDuration,
    onTick: handleTick,
    onComplete: handleTimerComplete,
    autoStart: phase === GamePhase.PLAYING,
  });

  useEffect(() => {
    if (phase === GamePhase.PLAYING && !isRunning) {
      restart();
    } else if (phase !== GamePhase.PLAYING && isRunning) {
      pause();
    }
  }, [phase, isRunning, restart, pause]);

  useEffect(() => {
    if (phase === GamePhase.HOME) {
      navigate(ROUTES.HOME);
    } else if (phase === GamePhase.END) {
      navigate(ROUTES.END);
    }
  }, [phase, navigate]);

  const handleCorrect = () => {
    playCorrect();
    markCorrect();
  };

  const handleSkip = () => {
    markSkipped();
  };

  const handleClaimSteal = (teamIndex: 0 | 1) => {
    playBuzz();
    claimSteal(teamIndex);
  };

  const handleEndTurnEarly = () => {
    pause();
    playTurnEnd();
    endTurn();
  };

  const handleExitGame = () => {
    if (window.confirm('האם לצאת מהמשחק? ההתקדמות תישמר.')) {
      navigate(ROUTES.HOME);
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden p-4 gap-3">

      {/* ── Header row ── */}
      <div className="flex justify-between items-center shrink-0">
        <Button variant="secondary" size="sm" onClick={handleExitGame}>
          יציאה
        </Button>
        {phase === GamePhase.PLAYING && (
          <Button variant="danger" size="sm" onClick={handleEndTurnEarly}>
            סיום תור
          </Button>
        )}
      </div>

      {/* ── PLAYING phase ── */}
      {phase === GamePhase.PLAYING && (
        <>
          <div className="shrink-0">
            <Timer secondsLeft={secondsLeft} totalSeconds={timerDuration} />
          </div>

          <div className="shrink-0">
            <ScoreBoard />
          </div>

          {/* Card fills all remaining vertical space */}
          <div className="flex-1 min-h-0">
            <CardDisplay disabled={!isRunning} />
          </div>

          {/* Buttons always anchored at bottom */}
          <div className="grid grid-cols-2 gap-4 shrink-0">
            <Button
              variant="success"
              size="xl"
              onClick={handleCorrect}
              disabled={!isRunning}
              className="h-20 text-2xl"
            >
              נכון ✓
            </Button>
            <Button
              variant="danger"
              size="xl"
              onClick={handleSkip}
              disabled={!isRunning}
              className="h-20 text-2xl"
            >
              דלג ✗
            </Button>
          </div>
        </>
      )}

      {/* ── STEAL phase ── */}
      {phase === GamePhase.STEAL && (
        <>
          <div className="shrink-0">
            <ScoreBoard />
          </div>

          <div className="shrink-0 text-center">
            <h2 className="text-2xl font-bold text-amber-400 animate-pulse">
              סיבוב גניבה!
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              מי מנחש ראשון את המילה?
            </p>
          </div>

          {/* Steal card fills all remaining vertical space */}
          <div className="flex-1 min-h-0">
            <StealCardDisplay />
          </div>

          {/* Buttons always anchored at bottom */}
          {stealClaimed ? (
            <div className="shrink-0 text-center py-6 text-3xl font-black text-emerald-400 animate-bounce">
              נגנב! 🎉
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 shrink-0">
                <Button
                  variant="team1"
                  size="xl"
                  onClick={() => handleClaimSteal(0)}
                  className="h-20 text-lg flex flex-col items-center justify-center gap-1"
                >
                  <span>{teams[0].name}</span>
                  <span className="text-2xl">🔔</span>
                </Button>
                <Button
                  variant="team2"
                  size="xl"
                  onClick={() => handleClaimSteal(1)}
                  className="h-20 text-lg flex flex-col items-center justify-center gap-1"
                >
                  <span>{teams[1].name}</span>
                  <span className="text-2xl">🔔</span>
                </Button>
              </div>
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                onClick={skipSteal}
                className="shrink-0"
              >
                אף אחד לא ידע — דלג
              </Button>
            </>
          )}
        </>
      )}

      {/* ── TURN SUMMARY phase ── */}
      {phase === GamePhase.TURN_SUMMARY && (
        <div className="flex-1 min-h-0 overflow-y-auto">
          <TurnSummary onContinue={proceedFromSummary} />
        </div>
      )}

    </div>
  );
}
