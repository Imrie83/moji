import { ThemeProvider, CssBaseline } from '@mui/material';
import { useMemo, useEffect, useState } from 'react';
import './App.css';
import { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import { SettingsBar } from './components/SettingsBar/SettingsBar';
import { GameArea } from './components/GameArea/GameArea';
import { useAppSettingsStore } from './store/appSettingsStore';
import { lightTheme, darkTheme } from './theme/theme';

function App() {
  const { theme } = useAppSettingsStore();
  const [init, setInit] = useState(false);

  // State to track system preference
  const [systemPrefersDark, setSystemPrefersDark] = useState(
    globalThis.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mediaQuery = globalThis.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Initialize tsparticles
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const activeTheme = useMemo(() => {
    if (theme === 'system') {
      return systemPrefersDark ? darkTheme : lightTheme;
    }
    return theme === 'dark' ? darkTheme : lightTheme;
  }, [theme, systemPrefersDark]);

  if (!init) return null;

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <div className="app">
        <SettingsBar />
        <div className="app-content">
          <GameArea />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
