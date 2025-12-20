import React from 'react';
import { Paper, Typography, Box, useTheme, alpha } from '@mui/material';
import type { Kanji } from '../../interfaces/kanji';

export interface KanjiTileProps {
    kanji: Kanji;
    showReading?: boolean;
    showMeaning?: boolean;
    status?: 'default' | 'correct' | 'incorrect';
}

export const KanjiTile: React.FC<KanjiTileProps> = ({
    kanji,
    showReading = false,
    showMeaning = false,
    status = 'default',
}) => {
    const theme = useTheme();

    // Determine background color based on status
    const getBackgroundColor = () => {
        switch (status) {
            case 'correct':
                return alpha(theme.palette.success.main, 0.2);
            case 'incorrect':
                return alpha(theme.palette.error.main, 0.2);
            default:
                return theme.palette.background.paper;
        }
    };

    const getBorderColor = () => {
        switch (status) {
            case 'correct':
                return theme.palette.success.main;
            case 'incorrect':
                return theme.palette.error.main;
            default:
                return theme.palette.divider;
        }
    };

    return (
        <Paper
            elevation={3}
            sx={{
                width: 160,
                height: 160,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 2,
                backgroundColor: getBackgroundColor(),
                border: `2px solid ${getBorderColor()}`,
                transition: 'all 0.3s ease',
                position: 'relative',
            }}
            data-testid="kanji-tile"
        >
            {/* Reading (Above) */}
            <Box sx={{ height: 24, display: 'flex', alignItems: 'center', mb: 1, width: '100%', justifyContent: 'center' }}>
                {showReading && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                        align="center"
                        sx={{ fontSize: '0.9rem' }}
                    >
                        {kanji.kunyomi.join(', ')}
                    </Typography>
                )}
            </Box>

            {/* Kanji (Center) */}
            <Typography
                variant="h2"
                component="div"
                sx={{
                    fontWeight: 'bold',
                    fontSize: '3.5rem',
                    lineHeight: 1,
                    mb: 1
                }}
            >
                {kanji.character}
            </Typography>

            {/* Meaning (Below) */}
            <Box sx={{ height: 40, display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                {showMeaning && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        align="center"
                        sx={{
                            fontSize: '0.8rem',
                            lineHeight: 1.2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}
                    >
                        {kanji.meaning.join(', ')}
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};
