import { ProgressBar } from '../ui';
import { TICK_START_SECONDS } from '../../consts';

interface TimerProps {
  secondsLeft: number;
  totalSeconds: number;
}

export function Timer({ secondsLeft, totalSeconds }: TimerProps) {
  const isWarning = secondsLeft <= TICK_START_SECONDS && secondsLeft > 0;
  const isDanger = secondsLeft <= 3 && secondsLeft > 0;

  const variant = isDanger ? 'danger' : isWarning ? 'warning' : 'default';

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-800/60 backdrop-blur rounded-2xl p-4">
      <div
        className={`
          text-6xl font-black text-center mb-3 transition-all
          ${isDanger ? 'text-rose-500 animate-pulse scale-110' : ''}
          ${isWarning && !isDanger ? 'text-amber-400' : ''}
          ${!isWarning ? 'text-white' : ''}
        `}
      >
        {formatTime(secondsLeft)}
      </div>
      <ProgressBar value={secondsLeft} max={totalSeconds} variant={variant} height="lg" />
    </div>
  );
}
