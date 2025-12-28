import { Box, Typography, useTheme, useMediaQuery, Backdrop, Fade, CircularProgress } from '@mui/material';
import { useEffect, useState, useMemo } from 'react';
import { KanjiTile } from '../KanjiTile/KanjiTile';
import { KanjiDetailTile } from '../KanjiDetailTile/KanjiDetailTile';
import { AnswerInput } from './AnswerInput';
import { useKanjiGameStore } from '../../store/kanjiGameStore';
import { useAppSettingsStore } from '../../store/appSettingsStore';
import { kanji_n5 } from '../../data/kanji_n5';
import { kanji_n4 } from '../../data/kanji_n4';
import { kanji_n3 } from '../../data/kanji_n3';
import { hiragana } from '../../data/hiragana';
import { katakana } from '../../data/katakana';
import type { Kana } from '../../interfaces/kana';

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
        resetGame,
    } = useKanjiGameStore();

    const { jlptLevels, characterType, kanaTypes, showReading, showMeaning, practiceLimit, readingMode, showExpandedCard, excludedCharacters } = useAppSettingsStore();

    // Responsive
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isLandscape = useMediaQuery('(max-height: 500px) and (orientation: landscape)');

    // Local state for transitions/delays
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

    // Compute combined character list based on mode (kanji or kana)
    const characterList = useMemo(() => {
        if (characterType === 'kana') {
            // Kana mode: combine selected kana types
            const combined: Kana[] = [];
            if (kanaTypes.has('hiragana')) combined.push(...hiragana);
            if (kanaTypes.has('katakana')) combined.push(...katakana);
            // Map kana to kanji format for compatibility with game store
            return combined.map(kana => ({
                character: kana.character,
                onyomi: [kana.romaji],
                kunyomi: [],
                meaning: [kana.type],
                level: 'N5' as const,
            }));
        } else {
            // Kanji mode: combine selected JLPT levels
            const combined = [];
            if (jlptLevels.has('N5')) combined.push(...kanji_n5);
            if (jlptLevels.has('N4')) combined.push(...kanji_n4);
            if (jlptLevels.has('N3')) combined.push(...kanji_n3);
            return combined;
        }
    }, [characterType, jlptLevels, kanaTypes]);

    // Initialize game when component mounts or when selected levels/types change
    useEffect(() => {
        if (characterList.length > 0) {
            resetGame();
            initializeGame(characterList, practiceLimit);
        } else {
            // If selection is empty, clear the game state
            resetGame();
        }
    }, [characterList, practiceLimit, resetGame, initializeGame, excludedCharacters]);

    const handleSubmit = (value: string) => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        const isCorrect = checkAnswer(value);

        const delay = isCorrect ? NEXT_KANJI_DELAY : INCORRECT_DELAY;

        // After a delay, add new kanji to queue and reset transition
        setTimeout(() => {
            nextKanji();
            setIsTransitioning(false);
        }, delay);
    };

    const currentKanji = queue[0];
    const upcomingKanji = queue.slice(1);
    const historyKanji = [...history].reverse(); // Most recent first (closest to center)

    // Close detail view when moving to next kanji
    useEffect(() => {
        setMobileDetailOpen(false);
    }, [currentKanji]);

    const correctReadingText = useMemo(() => {
        if (!currentKanji) return '';
        if (readingMode === 'onyomi') return currentKanji.onyomi.join(', ');
        if (readingMode === 'kunyomi') return currentKanji.kunyomi.join(', ');
        return [...currentKanji.onyomi, ...currentKanji.kunyomi].join(', ');
    }, [currentKanji, readingMode]);

    if (queue.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4, height: 300 }}>
                <CircularProgress />
            </Box>
        );
    }

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
                mt: isLandscape ? 0 : { xs: 2, sm: 4 },
                p: { xs: 1, sm: 2 },
                display: 'flex',
                flexDirection: 'column',
                gap: isLandscape ? 0.5 : { xs: 2, sm: 3 },
                overflow: 'hidden'
            }}
            data-testid="game-area"
        >
            {/* Kanji Display Area - The Carousel */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    py: isLandscape ? 1 : { xs: 2, sm: 4 },
                    minHeight: isLandscape ? 120 : { xs: 180, sm: 300 },
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
                    cursor: (isMobile && showExpandedCard) ? 'pointer' : 'default',
                    ...getTileStyle(0)
                }}
                    onClick={() => {
                        if (isMobile && showExpandedCard) {
                            setMobileDetailOpen(true);
                        }
                    }}
                >
                    <KanjiTile
                        kanji={currentKanji}
                        status={feedback === 'none' ? 'default' : feedback}
                        isAnimating={feedback !== 'none'}
                        showReading={showReading}
                        showMeaning={showMeaning}
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
                            <KanjiTile
                                kanji={kanji}
                                showReading={showReading}
                                showMeaning={showMeaning}
                            />
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
                        Incorrect! The reading was: {correctReadingText}
                    </Typography>
                )}
            </Box>
            {/* Expanded Card View (Desktop) */}
            {!isMobile && showExpandedCard && (
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <KanjiDetailTile kanji={currentKanji} />
                </Box>
            )}

            {/* Expanded Card Overlay (Mobile) */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, p: 2, bgcolor: 'rgba(0, 0, 0, 0.8)' }}
                open={mobileDetailOpen}
                onClick={() => setMobileDetailOpen(false)}
            >
                <Fade in={mobileDetailOpen}>
                    <Box onClick={(e) => e.stopPropagation()} sx={{ width: '100%', maxWidth: 400 }}>
                        <KanjiDetailTile kanji={currentKanji} />
                        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: 'white' }}>
                            Tap outside to close
                        </Typography>
                    </Box>
                </Fade>
            </Backdrop>
        </Box>
    );
};
