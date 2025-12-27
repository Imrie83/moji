import { IconButton, Box, Tooltip, Typography } from '@mui/material';
import { useAppSettingsStore, type JlptLevel } from '../../store/appSettingsStore';

const JLPT_LEVELS: JlptLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

export function JlptLevelSelector() {
    const { jlptLevels, toggleJlptLevel, characterType } = useAppSettingsStore();
    const isKanjiMode = characterType === 'kanji';

    return (
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <Typography
                variant="body2"
                sx={{
                    color: 'text.secondary',
                    opacity: 0.6,
                    fontSize: '1rem',
                    userSelect: 'none'
                }}
            >
                「
            </Typography>
            {JLPT_LEVELS.map((level) => (
                <Tooltip key={level} title={`Toggle ${level}`}>
                    <IconButton
                        onClick={() => toggleJlptLevel(level)}
                        color={jlptLevels.has(level) && isKanjiMode ? "primary" : "inherit"}
                        size="small"
                        aria-label={`Toggle ${level}`}
                        disabled={(level === 'N1' || level === 'N2') && isKanjiMode}
                        sx={{
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            opacity: isKanjiMode ? 1 : 0.4,
                        }}
                    >
                        {level}
                    </IconButton>
                </Tooltip>
            ))}
            <Typography
                variant="body2"
                sx={{
                    color: 'text.secondary',
                    opacity: 0.6,
                    fontSize: '1rem',
                    userSelect: 'none'
                }}
            >
                」
            </Typography>
        </Box>
    );
}
