import { Box, useMediaQuery, useTheme, Divider } from '@mui/material';
import { useState } from 'react';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { EffectsToggle } from '../EffectsToggle/EffectsToggle';
import { SettingsButton } from '../SettingsButton/SettingsButton';
import { JlptLevelSelector } from '../JlptLevelSelector/JlptLevelSelector';
import { KanaSelector } from '../KanaSelector/KanaSelector';
import { SettingsDialog } from '../SettingsDialog/SettingsDialog';

export function SettingsBar() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [settingsOpen, setSettingsOpen] = useState(false);

    if (isMobile) {
        return (
            <>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 1,
                        pt: 1,
                        px: 2,
                        pb: 1.5,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <JlptLevelSelector />
                        <Divider orientation="vertical" flexItem sx={{ height: 24, alignSelf: 'center' }} />
                        <KanaSelector />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <ThemeToggle />
                        <SettingsButton onClick={() => setSettingsOpen(true)} />
                    </Box>
                </Box>
                <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
            </>
        );
    }

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                    pt: 1,
                    px: 2,
                    pb: 1.5,
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
                    <SettingsButton onClick={() => setSettingsOpen(true)} />
                </Box>
            </Box>
            <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        </>
    );
}
