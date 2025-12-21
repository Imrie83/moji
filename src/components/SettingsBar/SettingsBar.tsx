import { Box } from '@mui/material';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { SettingsButton } from '../SettingsButton/SettingsButton';
import { SettingsActions } from '../SettingsActions/SettingsActions';
import { MobileMenu } from '../MobileMenu/MobileMenu';
import { EffectsToggle } from '../EffectsToggle/EffectsToggle';

export function SettingsBar() {
    return (
        <Box
            data-testid="settings-bar"
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: { xs: '8px 16px', md: '12px 24px' },
                backgroundColor: 'background.paper',
                borderBottom: 1,
                borderColor: 'divider',
                boxShadow: 1,
            }}
        >
            {/* Desktop view */}
            <Box
                data-testid="desktop-bar"
                sx={{
                    display: { xs: 'none', md: 'flex' },
                    alignItems: 'center',
                    gap: 2,
                    width: '100%',
                    justifyContent: 'space-between',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <SettingsActions />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <EffectsToggle />
                    <ThemeToggle />
                    <SettingsButton />
                </Box>
            </Box>

            {/* Mobile view */}
            <Box
                data-testid="mobile-bar"
                sx={{
                    display: { xs: 'flex', md: 'none' },
                    width: '100%',
                    justifyContent: 'flex-end',
                }}
            >
                <MobileMenu />
            </Box>
        </Box>
    );
}
