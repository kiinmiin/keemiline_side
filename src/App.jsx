import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProgressProvider } from './context/ProgressContext';
import { LanguageProvider } from './context/LanguageContext';
import { SplashScreen } from './components/navigation/SplashScreen';
import { GameHub } from './components/navigation/GameHub';
import { BondTypesSorting } from './games/BondTypesSorting/BondTypesSorting';
import { BondFormation } from './games/BondFormation/BondFormation';
import { ElectronegativityMatch } from './games/ElectronegativityMatch/ElectronegativityMatch';
import { BondPolarityQuiz } from './games/BondPolarityQuiz/BondPolarityQuiz';
import { MoleculeBuilder } from './games/MoleculeBuilder/MoleculeBuilder';
import { BondBasketCatcher } from './games/BondBasketCatcher/BondBasketCatcher';
import { FillInTheBlank } from './games/FillInTheBlank/FillInTheBlank';
import './App.module.css';

function App() {
  return (
    <LanguageProvider>
      <ProgressProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/hub" element={<GameHub />} />
            <Route path="/game/fill-in-the-blank" element={<FillInTheBlank />} />
            <Route path="/game/bond-types" element={<BondTypesSorting />} />
            <Route path="/game/bond-formation" element={<BondFormation />} />
            <Route path="/game/electronegativity" element={<ElectronegativityMatch />} />
            <Route path="/game/bond-polarity" element={<BondPolarityQuiz />} />
            <Route path="/game/molecule-builder" element={<MoleculeBuilder />} />
            <Route path="/game/bond-basket" element={<BondBasketCatcher />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ProgressProvider>
    </LanguageProvider>
  );
}

export default App;
