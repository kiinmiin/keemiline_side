import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProgressProvider } from './context/ProgressContext';
import { SplashScreen } from './components/navigation/SplashScreen';
import { GameHub } from './components/navigation/GameHub';
import { BondTypesSorting } from './games/BondTypesSorting/BondTypesSorting';
import { BondFormation } from './games/BondFormation/BondFormation';
import './App.module.css';

function App() {
  return (
    <ProgressProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/hub" element={<GameHub />} />
          <Route path="/game/bond-types" element={<BondTypesSorting />} />
          <Route path="/game/bond-formation" element={<BondFormation />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ProgressProvider>
  );
}

export default App;
