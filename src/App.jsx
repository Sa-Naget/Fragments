import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import ThemeToggle from './components/ThemeToggle.jsx';
import DustMites from './components/DustMites.jsx';
import { AuthProvider } from './lib/AuthContent.jsx';
import Landing from './pages/Landing.jsx';
import Home from './pages/home.jsx';
import CharacterPage from './pages/CharacterPage.jsx';
import AUPage from './pages/AUPage.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

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
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ThemeToggle />
        <DustMites />
        <AnimatedRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;