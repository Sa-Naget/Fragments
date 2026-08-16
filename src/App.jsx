import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import ThemeToggle from './components/ThemeToggle';
import DustMites from './components/DustMites.jsx';
import Landing from './pages/Landing';
import Home from './pages/Home';
import CharacterPage from './pages/CharacterPage';
import AUPage from './pages/AUPage';

function AnimatedRoutes() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fade-in');

  if (location.pathname !== displayLocation.pathname && transitionStage !== 'fade-out') {
    setTransitionStage('fade-out');
  }

  const handleAnimationEnd = () => {
    if (transitionStage === 'fade-out') {
      setDisplayLocation(location);
      setTransitionStage('fade-in');
    }
  };

  return (
    <div className={`page-transition ${transitionStage}`} onAnimationEnd={handleAnimationEnd}>
      <Routes location={displayLocation}>
        <Route path="/" element={<Landing />} />
        <Route path="/archive" element={<Home />} />
        <Route path="/character/:slug" element={<CharacterPage />} />
        <Route path="/au/:slug" element={<AUPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeToggle />
      <DustMites />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;