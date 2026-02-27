import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { GamePhase } from '../store/types';
import { useTimer } from '../hooks/useTimer';
import { useAudio } from '../hooks/useAudio';
import { CardDisplay, ScoreBoard, StealRound, TurnSummary, Timer } from '../components/game';
import { Button } from '../components/ui';
import { ROUTES, TICK_START_SECONDS } from '../consts';

export function GameBoardPage() {
  const navigate = useNavigate();
  const {
    phase,
    timerDuration,
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

  const handleContinue = () => {
    proceedFromSummary();
  };

  const handleExitGame = () => {
    if (window.confirm('האם לצאת מהמשחק? ההתקדמות תישמר.')) {
      navigate(ROUTES.HOME);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4">
      <div className="flex justify-between items-center mb-4">
        <Button variant="secondary" size="sm" onClick={handleExitGame}>
          יציאה
        </Button>
        {phase === GamePhase.PLAYING && (
          <Button variant="danger" size="sm" onClick={handleEndTurnEarly}>
            סיום תור
          </Button>
        )}
      </div>

      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full gap-4">
        {phase === GamePhase.PLAYING && (
          <>
            <Timer secondsLeft={secondsLeft} totalSeconds={timerDuration} />
            <ScoreBoard />
            <CardDisplay
              onCorrect={handleCorrect}
              onSkip={handleSkip}
              disabled={!isRunning}
            />
          </>
        )}

        {phase === GamePhase.STEAL && (
          <>
            <ScoreBoard />
            <StealRound onClaim={handleClaimSteal} onSkip={skipSteal} />
          </>
        )}

        {phase === GamePhase.TURN_SUMMARY && (
          <>
            <TurnSummary onContinue={handleContinue} />
          </>
        )}
      </div>
    </div>
  );
}
