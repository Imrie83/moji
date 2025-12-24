import { IconButton, Box, Tooltip, Typography } from '@mui/material';
import { useAppSettingsStore, type JlptLevel } from '../../store/appSettingsStore';

const JLPT_LEVELS: JlptLevel[] = ['N5', 'N4', 'N3'];

export function JlptLevelSelector() {
    const { jlptLevels, toggleJlptLevel } = useAppSettingsStore();

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
                        color={jlptLevels.has(level) ? "primary" : "inherit"}
                        size="small"
                        aria-label={`Toggle ${level}`}
                        sx={{
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            fontWeight: 600,
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
