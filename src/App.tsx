import { ThemeProvider, CssBaseline } from '@mui/material';
import { useMemo, useEffect, useState } from 'react';
import './App.css';
import { SettingsBar } from './components/SettingsBar/SettingsBar';
import { useAppSettingsStore } from './store/appSettingsStore';
import { lightTheme, darkTheme } from './theme/theme';

function App() {
  const { theme } = useAppSettingsStore();

  // State to track system preference
  const [systemPrefersDark, setSystemPrefersDark] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const activeTheme = useMemo(() => {
    if (theme === 'system') {
      return systemPrefersDark ? darkTheme : lightTheme;
    }
    return theme === 'dark' ? darkTheme : lightTheme;
  }, [theme, systemPrefersDark]);

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <div className="app">
        <SettingsBar />
        <div className="app-content">
          <h1>React + TypeScript + Vite</h1>
          <p>Start building your application here!</p>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
