import { IconButton, Tooltip } from '@mui/material';
import Brightness4 from '@mui/icons-material/Brightness4';
import Brightness7 from '@mui/icons-material/Brightness7';
import { useAppSettingsStore } from '../../store/appSettingsStore';

export function ThemeToggle() {
    const { theme, setTheme } = useAppSettingsStore();

    // Determine the effective theme (resolve 'system' to actual theme)
    const getEffectiveTheme = () => {
        if (theme === 'system') {
            return globalThis.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return theme;
    };

    const effectiveTheme = getEffectiveTheme();
    const isDark = effectiveTheme === 'dark';

    const handleToggle = () => {
        // Toggle between light and dark
        setTheme(isDark ? 'light' : 'dark');
    };

    return (
        <Tooltip title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
            <IconButton
                onClick={handleToggle}
                color="inherit"
                size="small"
                aria-label="Toggle theme"
            >
                {isDark ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
            </IconButton>
        </Tooltip>
    );
}
