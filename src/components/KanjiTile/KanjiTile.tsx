import { Paper, Typography, Box, useTheme, alpha, useMediaQuery } from '@mui/material';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Kanji } from '../../interfaces/kanji';
import { useAppSettingsStore } from '../../store/appSettingsStore';
import { ParticlesEffect } from '../ParticlesEffect/ParticlesEffect';
import * as wanakana from 'wanakana';

export interface KanjiTileProps {
    kanji: Kanji;
    showReading?: boolean;
    showMeaning?: boolean;
    status?: 'default' | 'correct' | 'incorrect';
    isAnimating?: boolean;
}

const MotionPaper = motion(Paper);

export const KanjiTile: React.FC<KanjiTileProps> = ({
    kanji,
    showReading = false,
    showMeaning = false,
    status = 'default',
    isAnimating = false,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { effectsLevel } = useAppSettingsStore();
    const isPremium = effectsLevel === 'premium';

    // Determine dimensions based on device
    const width = isMobile ? 85 : 120;
    const height = isMobile ? 115 : 160;

    // Standard CSS Animations
    const shakeAnimation = {
        '@keyframes shake': {
            '0%, 100%': { transform: 'translateX(0)' },
            '20%, 60%': { transform: 'translateX(-5px)' },
            '40%, 80%': { transform: 'translateX(5px)' },
        },
        animation: (status === 'incorrect' && isAnimating && !isPremium) ? 'shake 0.4s ease-in-out' : 'none',
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

    // Premium Shake logic
    const premiumShakeProps = isPremium && status === 'incorrect' && isAnimating ? {
        animate: {
            x: [0, -10, 10, -10, 10, -5, 5, 0],
            rotate: [0, -1, 1, -1, 1, 0],
        },
        transition: {
            duration: 0.5,
            ease: "easeInOut" as const,
        }
    } : {};

    return (
        <MotionPaper
            {...(premiumShakeProps as any)}
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
                overflow: (status === 'correct' && isAnimating) ? 'visible' : 'hidden',
                ...(!isPremium ? shakeAnimation : {}),
            }}
            data-testid="kanji-tile"
        >
            {/* Starburst/Particle Overlay */}
            <AnimatePresence>
                {(status === 'correct' && isAnimating) && (
                    isPremium ? (
                        <ParticlesEffect
                            key={`particles-${kanji.character}`}
                            id={`particles-${kanji.character}`}
                        />
                    ) : (
                        <Box key="standard-starburst" sx={starburstAnimation} />
                    )
                )}
            </AnimatePresence>

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
                        {wanakana.toHiragana(kanji.onyomi.join(', '))}
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
                {(() => {
                    const text = kanji.character;
                    // Small kana characters that should be rendered smaller
                    const smallKana = ['ゃ', 'ゅ', 'ょ', 'ャ', 'ュ', 'ョ', 'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ', 'ァ', 'ィ', 'ゥ', 'ェ', 'ォ', 'っ', 'ッ', 'ゎ', 'ヮ'];

                    // If it's a multi-character string with small kana, render with sizing
                    if (text.length > 1 && text.split('').some(char => smallKana.includes(char))) {
                        return (
                            <span>
                                {text.split('').map((char, index) => (
                                    <span
                                        key={index}
                                        style={{
                                            fontSize: smallKana.includes(char) ? '0.7em' : '1em',
                                            verticalAlign: smallKana.includes(char) ? '0.1em' : 'baseline',
                                        }}
                                    >
                                        {char}
                                    </span>
                                ))}
                            </span>
                        );
                    }

                    return text;
                })()}
            </Typography>

            {/* Meaning (Below) */}
            <Box sx={{ height: isMobile ? 24 : 40, display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                {showMeaning && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        align="center"
                        sx={{
                            fontSize: isMobile ? '0.8rem' : '1rem',
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
        </MotionPaper>
    );
};
