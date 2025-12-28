import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import MenuOutlined from '@mui/icons-material/MenuOutlined';
import Brightness4 from '@mui/icons-material/Brightness4';
import Brightness7 from '@mui/icons-material/Brightness7';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useAppSettingsStore } from '../../store/appSettingsStore';

export function MobileMenu() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { theme, setTheme, effectsLevel, setEffectsLevel } = useAppSettingsStore();
    const open = Boolean(anchorEl);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // Determine the effective theme (resolve 'system' to actual theme)
    const getEffectiveTheme = () => {
        if (theme === 'system') {
            return globalThis.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return theme;
    };

    const effectiveTheme = getEffectiveTheme();
    const isDark = effectiveTheme === 'dark';

    const handleThemeToggle = () => {
        setTheme(isDark ? 'light' : 'dark');
        // Optional: close menu on toggle? Usually better to keep open for multiple changes
    };

    const handleEffectsToggle = () => {
        setEffectsLevel(effectsLevel === 'premium' ? 'standard' : 'premium');
    };

    return (
        <>
            <IconButton
                onClick={handleOpen}
                aria-label="Open menu"
                aria-controls={open ? 'mobile-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
            >
                <MenuOutlined />
            </IconButton>
            <Menu
                id="mobile-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    list: {
                        'aria-labelledby': 'mobile-menu-button',
                    }
                }}
            >
                <MenuItem onClick={handleThemeToggle}>
                    <ListItemIcon>
                        {isDark ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
                    </ListItemIcon>
                    <ListItemText>
                        Theme: {isDark ? 'Dark' : 'Light'}
                    </ListItemText>
                </MenuItem>
                <MenuItem onClick={handleEffectsToggle}>
                    <ListItemIcon>
                        <AutoAwesomeIcon
                            fontSize="small"
                            color={effectsLevel === 'premium' ? 'primary' : 'disabled'}
                        />
                    </ListItemIcon>
                    <ListItemText>
                        FX: {effectsLevel === 'premium' ? 'Premium' : 'Standard'}
                    </ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
}
