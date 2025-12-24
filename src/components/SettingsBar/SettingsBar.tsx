import { Box, useMediaQuery, useTheme, Divider } from '@mui/material';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { EffectsToggle } from '../EffectsToggle/EffectsToggle';
import { SettingsButton } from '../SettingsButton/SettingsButton';
import { JlptLevelSelector } from '../JlptLevelSelector/JlptLevelSelector';
import { KanaSelector } from '../KanaSelector/KanaSelector';

export function SettingsBar() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    if (isMobile) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 1,
                    p: 2,
                }}
            >
                <SettingsButton />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
                p: 2,
            }}
        >
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <JlptLevelSelector />
                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                <KanaSelector />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <EffectsToggle />
                <ThemeToggle />
                <SettingsButton />
            </Box>
        </Box>
    );
}
