import { useState } from 'react';
import { IconButton, Menu, MenuItem, Switch, Box, Typography } from '@mui/material';
import MenuOutlined from '@mui/icons-material/MenuOutlined';
import Brightness4 from '@mui/icons-material/Brightness4';
import Brightness7 from '@mui/icons-material/Brightness7';
import { useAppSettingsStore } from '../../store/appSettingsStore';

export function MobileMenu() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { theme, setTheme } = useAppSettingsStore();
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
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return theme;
    };

    const effectiveTheme = getEffectiveTheme();
    const isDark = effectiveTheme === 'dark';

    const handleThemeToggle = () => {
        setTheme(isDark ? 'light' : 'dark');
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
                MenuListProps={{
                    'aria-labelledby': 'mobile-menu-button',
                }}
            >
                <MenuItem>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                        {isDark ? <Brightness4 fontSize="small" /> : <Brightness7 fontSize="small" />}
                        <Typography sx={{ flexGrow: 1 }}>Theme</Typography>
                        <Switch
                            checked={isDark}
                            onChange={handleThemeToggle}
                            size="small"
                            inputProps={{ 'aria-label': 'Toggle theme' }}
                        />
                    </Box>
                </MenuItem>
                <MenuItem onClick={handleClose}>Action 1</MenuItem>
                <MenuItem onClick={handleClose}>Action 2</MenuItem>
                <MenuItem onClick={handleClose}>Action 3</MenuItem>
            </Menu>
        </>
    );
}
