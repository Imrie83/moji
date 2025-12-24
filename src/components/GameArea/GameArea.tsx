import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { useEffect, useState, useMemo } from 'react';
import { KanjiTile } from '../KanjiTile/KanjiTile';
import { AnswerInput } from './AnswerInput';
import { useKanjiGameStore } from '../../store/kanjiGameStore';
import { useAppSettingsStore } from '../../store/appSettingsStore';
import { kanji_n5 } from '../../data/kanji_n5';
import { kanji_n4 } from '../../data/kanji_n4';
import { kanji_n3 } from '../../data/kanji_n3';

// Delay before switching to next Kanji after correct answer
const NEXT_KANJI_DELAY = 600;
const INCORRECT_DELAY = 800; // Longer delay for incorrect to see the damage

export const GameArea = () => {
    // Stores
    const {
        queue,
        history,
        nextKanji,
        checkAnswer,
        feedback,
        initializeGame,
        resetGame
    } = useKanjiGameStore();

    const { jlptLevels } = useAppSettingsStore();

    // Responsive
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Local state for transitions/delays
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Compute combined kanji list based on selected JLPT levels
    const kanjiList = useMemo(() => {
        const combined = [];
        if (jlptLevels.has('N5')) combined.push(...kanji_n5);
        if (jlptLevels.has('N4')) combined.push(...kanji_n4);
        if (jlptLevels.has('N3')) combined.push(...kanji_n3);
        return combined;
    }, [jlptLevels]);

    // Initialize game when component mounts or when selected levels change
    useEffect(() => {
        if (kanjiList.length > 0) {
            resetGame();
            initializeGame(kanjiList);
        }
    }, [kanjiList, initializeGame, resetGame]);

    const handleSubmit = (value: string) => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        const isCorrect = checkAnswer(value);

        const delay = isCorrect ? NEXT_KANJI_DELAY : INCORRECT_DELAY;

        // After a delay, add new kanji to queue and reset transition
        setTimeout(() => {
            nextKanji(kanjiList);
            setIsTransitioning(false);
        }, delay);
    };

    if (queue.length === 0) {
        return <Box sx={{ p: 4, textAlign: 'center' }}>Loading...</Box>;
    }

    const currentKanji = queue[0];
    const upcomingKanji = queue.slice(1);
    const historyKanji = [...history].reverse(); // Most recent first (closest to center)

    const getTileStyle = (distance: number) => {
        const factor = 1 - (distance * 0.1);
        const scale = Math.max(0.5, factor);
        const opacity = Math.max(0.5, factor);

        // Margin compensation to keep visual gap consistent
        // Base width matches KanjiTile width (85 on mobile, 120 on desktop)
        const baseWidth = isMobile ? 85 : 120;
        const marginCompensation = -(baseWidth * (1 - scale)) / 2;

        return {
            transform: `scale(${scale})`,
            opacity,
            mx: `${marginCompensation}px`,
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 10 - distance,
        };
    };

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: 1200,
                mx: 'auto',
                mt: { xs: 2, sm: 4 },
                p: { xs: 1, sm: 2 },
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 2, sm: 3 },
                overflow: 'hidden'
            }}
            data-testid="game-area"
        >
            {/* Kanji Display Area - The Carousel */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    py: { xs: 2, sm: 4 },
                    minHeight: { xs: 180, sm: 300 },
                    width: '100%',
                    position: 'relative'
                }}
            >
                {/* History Tiles (Left) */}
                <Box sx={{
                    flex: 1,
                    display: 'flex',
                    gap: 1,
                    flexDirection: 'row-reverse',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    minWidth: 0,
                    pr: 1
                }}>
                    {historyKanji.map((item, index) => (
                        <Box key={`history-${item.kanji.character}-${index}`} sx={getTileStyle(index + 1)}>
                            <KanjiTile
                                kanji={item.kanji}
                                status={item.status}
                                showReading={true}
                                showMeaning={true}
                            />
                        </Box>
                    ))}
                </Box>

                {/* Current Tile (Center) */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: '0 0 auto',
                    ...getTileStyle(0)
                }}>
                    <KanjiTile
                        kanji={currentKanji}
                        status={feedback === 'none' ? 'default' : feedback}
                        isAnimating={feedback !== 'none'}
                    />
                </Box>

                {/* Queue Tiles (Right) */}
                <Box sx={{
                    flex: 1,
                    display: 'flex',
                    gap: 1,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    minWidth: 0,
                    pl: 1
                }}>
                    {upcomingKanji.map((kanji, index) => (
                        <Box key={`queue-${kanji.character}-${index}`} sx={getTileStyle(index + 1)}>
                            <KanjiTile kanji={kanji} />
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Input Area */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <AnswerInput
                    onSubmit={handleSubmit}
                    disabled={isTransitioning}
                />
            </Box>

            {/* Feedback Message */}
            <Box sx={{ height: 24, textAlign: 'center' }}>
                {feedback === 'incorrect' && (
                    <Typography color="error" variant="body2" sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        Incorrect! The reading was: {currentKanji.onyomi.join(', ')}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};
