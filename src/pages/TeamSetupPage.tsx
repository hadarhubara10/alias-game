import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import { useGameStore } from '../store/gameStore';
import { ROUTES, MIN_TIMER_DURATION, MAX_TIMER_DURATION } from '../consts';

export function TeamSetupPage() {
  const navigate = useNavigate();
  const { teams, timerDuration, setTeamName, setTimerDuration, startGame } =
    useGameStore();

  const [team1Name, setTeam1Name] = useState(teams[0].name);
  const [team2Name, setTeam2Name] = useState(teams[1].name);
  const [duration, setDuration] = useState(timerDuration);

  const handleStart = () => {
    setTeamName(0, team1Name.trim() || 'קבוצה א׳');
    setTeamName(1, team2Name.trim() || 'קבוצה ב׳');
    setTimerDuration(duration);
    startGame();
    navigate(ROUTES.GAME);
  };

  const handleBack = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-black text-white text-center mb-8">
          🇮🇱 הגדרת קבוצות 🇮🇱
        </h1>

        <div className="bg-blue-950/60 backdrop-blur rounded-3xl p-6 space-y-6 border-2 border-white/30">
          <div>
            <label className="block text-blue-200 font-semibold mb-2">
              🔵 שם קבוצה 1
            </label>
            <input
              type="text"
              value={team1Name}
              onChange={(e) => setTeam1Name(e.target.value)}
              className="w-full px-4 py-3 bg-blue-900/50 border-2 border-blue-500 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="קבוצה א׳"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">
              ⚪ שם קבוצה 2
            </label>
            <input
              type="text"
              value={team2Name}
              onChange={(e) => setTeam2Name(e.target.value)}
              className="w-full px-4 py-3 bg-white/90 border-2 border-white rounded-xl text-blue-900 text-lg focus:outline-none focus:ring-2 focus:ring-white placeholder-blue-400"
              placeholder="קבוצה ב׳"
            />
          </div>

          <div>
            <label className="block text-sky-200 font-semibold mb-2">
              זמן לסיבוב: {duration} שניות
            </label>
            <input
              type="range"
              min={MIN_TIMER_DURATION}
              max={MAX_TIMER_DURATION}
              step={5}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-base text-sky-200/70 mt-1">
              <span>{MIN_TIMER_DURATION}s</span>
              <span>{MAX_TIMER_DURATION}s</span>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="secondary" size="lg" onClick={handleBack}>
              חזרה
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleStart}
            >
              התחל לשחק!
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
