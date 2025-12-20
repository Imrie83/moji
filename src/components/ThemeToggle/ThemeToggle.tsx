import { Switch, IconButton, Box } from '@mui/material';
import Brightness4 from '@mui/icons-material/Brightness4';
import Brightness7 from '@mui/icons-material/Brightness7';
import { useAppSettingsStore } from '../../store/appSettingsStore';

export function ThemeToggle() {
    const { theme, setTheme } = useAppSettingsStore();

    // Determine the effective theme (resolve 'system' to actual theme)
    const getEffectiveTheme = () => {
        if (theme === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return theme;
    };

    const effectiveTheme = getEffectiveTheme();
    const isDark = effectiveTheme === 'dark';

    const handleToggle = () => {
        // Toggle between light and dark (skip system for manual toggle)
        setTheme(isDark ? 'light' : 'dark');
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton size="small" disabled sx={{ color: isDark ? 'text.secondary' : 'warning.main' }}>
                <Brightness7 fontSize="small" />
            </IconButton>
            <Switch
                checked={isDark}
                onChange={handleToggle}
                inputProps={{ 'aria-label': 'Toggle theme' }}
                size="small"
            />
            <IconButton size="small" disabled sx={{ color: isDark ? 'primary.main' : 'text.secondary' }}>
                <Brightness4 fontSize="small" />
            </IconButton>
        </Box>
    );
}
