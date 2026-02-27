import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  HomePage,
  TeamSetupPage,
  GameBoardPage,
  AdminPanelPage,
  EndScreenPage,
} from './pages';
import { ROUTES } from './consts';
import { useVisualViewport } from './hooks/useVisualViewport';

function App() {
  useVisualViewport();

  return (
    <BrowserRouter basename="/alias-game/">
      <div className="h-full text-white" dir="rtl">
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.TEAM_SETUP} element={<TeamSetupPage />} />
          <Route path={ROUTES.GAME} element={<GameBoardPage />} />
          <Route path={ROUTES.ADMIN} element={<AdminPanelPage />} />
          <Route path={ROUTES.END} element={<EndScreenPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
