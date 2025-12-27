import React from 'react';
import { Paper, Typography, Box, IconButton, Tooltip, Chip, useTheme, useMediaQuery } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import type { Kanji } from '../../interfaces/kanji';
import * as wanakana from 'wanakana';

interface KanjiDetailTileProps {
    kanji: Kanji;
}

export const KanjiDetailTile: React.FC<KanjiDetailTileProps> = ({ kanji }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Paper
            elevation={4}
            sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: 400,
                width: '100%',
                margin: '0 auto',
                borderRadius: 2,
                position: 'relative',
                border: `${isMobile ? 1 : 2}px solid ${theme.palette.divider}`,
                background: theme.palette.background.paper,
            }}
        >
            {/* Audio Icon Placeholder */}
            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                <Tooltip title="Play Audio (Coming Soon)">
                    <IconButton size="small">
                        <VolumeUpIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Big Kanji Character */}
            <Typography
                variant="h1"
                component="div"
                sx={{
                    fontWeight: 'bold',
                    fontSize: '6rem',
                    mb: 2,
                    lineHeight: 1,
                }}
            >
                {kanji.character}
            </Typography>

            {/* Readings Section */}
            <Box sx={{ width: '100%', mb: 2 }}>
                <Box sx={{ mb: 1.5 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom align="center">
                        Onyomi
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                        {kanji.onyomi.length > 0 ? (
                            kanji.onyomi.map((reading) => (
                                <Chip
                                    key={`on-${reading}`}
                                    label={wanakana.toKatakana(reading)}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                />
                            ))
                        ) : (
                            <Typography variant="body2" color="text.disabled">—</Typography>
                        )}
                    </Box>
                </Box>

                <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom align="center">
                        Kunyomi
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                        {kanji.kunyomi.length > 0 ? (
                            kanji.kunyomi.map((reading) => (
                                <Chip
                                    key={`kun-${reading}`}
                                    label={wanakana.toHiragana(reading)}
                                    size="small"
                                    color="secondary"
                                    variant="outlined"
                                />
                            ))
                        ) : (
                            <Typography variant="body2" color="text.disabled">—</Typography>
                        )}
                    </Box>
                </Box>
            </Box>

            {/* Meanings Section */}
            <Box sx={{ width: '100%', mb: 1, textAlign: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Meanings
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {kanji.meaning.join(', ')}
                </Typography>
            </Box>
        </Paper>
    );
};
