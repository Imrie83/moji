import { Paper, Typography, Box, useTheme, alpha, useMediaQuery } from '@mui/material';
import type { Kanji } from '../../interfaces/kanji';

export interface KanjiTileProps {
    kanji: Kanji;
    showReading?: boolean;
    showMeaning?: boolean;
    status?: 'default' | 'correct' | 'incorrect';
    isAnimating?: boolean;
}

export const KanjiTile: React.FC<KanjiTileProps> = ({
    kanji,
    showReading = false,
    showMeaning = false,
    status = 'default',
    isAnimating = false,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Determine dimensions based on device
    const width = isMobile ? 85 : 120;
    const height = isMobile ? 115 : 160;

    // Define animations
    const shakeAnimation = {
        '@keyframes shake': {
            '0%, 100%': { transform: 'translateX(0)' },
            '20%, 60%': { transform: 'translateX(-5px)' },
            '40%, 80%': { transform: 'translateX(5px)' },
        },
        animation: (status === 'incorrect' && isAnimating) ? 'shake 0.4s ease-in-out' : 'none',
    };

    const starburstAnimation = {
        '@keyframes starburst': {
            '0%': {
                transform: 'scale(0.5)',
                opacity: 0,
            },
            '20%': {
                opacity: 0.8,
            },
            '100%': {
                transform: 'scale(2.5)',
                opacity: 0,
            },
        },
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '100px',
        height: '100px',
        marginLeft: '-50px',
        marginTop: '-50px',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 20,
        background: `radial-gradient(circle, ${theme.palette.success.light} 0%, transparent 70%)`,
        animation: (status === 'correct' && isAnimating) ? 'starburst 0.6s ease-out forwards' : 'none',
    };

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
                width,
                height,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: isMobile ? 1 : 2,
                backgroundColor: getBackgroundColor(),
                border: `${isMobile ? 1 : 2}px solid ${getBorderColor()}`,
                transition: 'all 0.3s ease',
                position: 'relative',
                ...shakeAnimation,
            }}
            data-testid="kanji-tile"
        >
            {/* Starburst Overlay */}
            {(status === 'correct' && isAnimating) && <Box sx={starburstAnimation} />}

            {/* Reading (Above) */}
            <Box sx={{ height: isMobile ? 16 : 24, display: 'flex', alignItems: 'center', mb: 0.5, width: '100%', justifyContent: 'center' }}>
                {showReading && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                        align="center"
                        sx={{ fontSize: isMobile ? '0.65rem' : '0.9rem' }}
                    >
                        {kanji.onyomi.join(', ')}
                    </Typography>
                )}
            </Box>

            {/* Kanji (Center) */}
            <Typography
                variant="h2"
                component="div"
                sx={{
                    fontWeight: 'bold',
                    fontSize: isMobile ? '2.2rem' : '3.5rem',
                    lineHeight: 1,
                    mb: 0.5,
                }}
            >
                {kanji.character}
            </Typography>

            {/* Meaning (Below) */}
            <Box sx={{ height: isMobile ? 24 : 40, display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                {showMeaning && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        align="center"
                        sx={{
                            fontSize: isMobile ? '0.6rem' : '0.8rem',
                            lineHeight: 1.2,
                            display: '-webkit-box',
                            WebkitLineClamp: isMobile ? 1 : 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {kanji.meaning.join(', ')}
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};
