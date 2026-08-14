import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

function getDefaultTheme() {
  const saved = localStorage.getItem('fragments-theme');
  if (saved === 'morning' || saved === 'night') return saved;

  const hour = new Date().getHours();
  // 6am–6pm counts as "morning" (sunlit), else "night"
  return hour >= 6 && hour < 18 ? 'morning' : 'night';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getDefaultTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('fragments-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'morning' ? 'night' : 'morning'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return useContext(ThemeContext);
}