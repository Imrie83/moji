import { Box, Typography, Fade, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import { KanjiTile } from '../KanjiTile/KanjiTile';
import { AnswerInput } from './AnswerInput';
import { useKanjiGameStore } from '../../store/kanjiGameStore';
import { useAppSettingsStore } from '../../store/appSettingsStore';
import { kanji_n5 } from '../../data/kanji_n5'; // Default to N5 for now, or use all eventually

// Delay before switching to next Kanji after correct answer
const NEXT_KANJI_DELAY = 500;
const ERROR_DISPLAY_DELAY = 500;

export const GameArea = () => {
    // Stores
    const {
        currentKanji,
        nextKanji,
        checkAnswer,
        feedback,
        initializeGame
    } = useKanjiGameStore();

    const { kanjiCurrentScore, kanjiTopScore } = useAppSettingsStore();

    // Local state for transitions/delays
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        // Initialize game on mount if not ready
        initializeGame(kanji_n5); // TODO: Make this dynamic based on settings later
    }, [initializeGame]);

    const handleSubmit = (value: string) => {
        if (isTransitioning) return;

        const correct = checkAnswer(value);
        if (correct) {
            setIsTransitioning(true);
            setTimeout(() => {
                nextKanji(kanji_n5);
                setIsTransitioning(false);
            }, NEXT_KANJI_DELAY);
        } else {
            // Shake/Error effect handled by store feedback state passed to components
            setTimeout(() => {
                // Optional: Clear feedback state if we want to reset visual cues
                // checkAnswer handles logic, but maybe we want to reset feedback to 'none' after a bit?
                // For now, let it stay incorrect until they try again?
                // Or maybe just flash it. relying on store for now.
            }, ERROR_DISPLAY_DELAY);
        }
    };

    if (!currentKanji) {
        return <Box sx={{ p: 4, textAlign: 'center' }}>Loading...</Box>;
    }

    return (
        <Box
            sx={{
                maxWidth: 600,
                mx: 'auto',
                mt: 4,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 3
            }}
            data-testid="game-area"
        >
            {/* Score Bar */}
            <Paper
                elevation={1}
                sx={{
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    bgcolor: 'background.default',
                    border: 1,
                    borderColor: 'divider'
                }}
            >
                <Box>
                    <Typography variant="overline" display="block" lineHeight={1}>
                        Current Score
                    </Typography>
                    <Typography variant="h4" color="primary.main" fontWeight="bold">
                        {kanjiCurrentScore}
                    </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="overline" display="block" lineHeight={1}>
                        Top Score
                    </Typography>
                    <Typography variant="h4" color="text.secondary" fontWeight="bold">
                        {kanjiTopScore}
                    </Typography>
                </Box>
            </Paper>

            {/* Kanji Display Area */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    py: 2,
                    minHeight: 200
                }}
            >
                <Fade in={!isTransitioning} timeout={300}>
                    <Box>
                        <KanjiTile
                            kanji={currentKanji}
                            showReading={false} // Hidden until maybe guessed? Or never? Logic asks for input.
                            showMeaning={false} // Hidden until guessed?
                            status={feedback === 'correct' ? 'correct' : feedback === 'incorrect' ? 'incorrect' : 'default'}
                        />
                    </Box>
                </Fade>
            </Box>

            {/* Input Area */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <AnswerInput
                    onSubmit={handleSubmit}
                    disabled={isTransitioning}
                />
            </Box>

            {/* Feedback Message (Optional) */}
            <Box sx={{ height: 24, textAlign: 'center' }}>
                {feedback === 'incorrect' && (
                    <Typography color="error" variant="body2">
                        Try again!
                    </Typography>
                )}
            </Box>
        </Box>
    );
};
