import { IconButton, Box, Tooltip, Typography } from '@mui/material';
import { useAppSettingsStore } from '../../store/appSettingsStore';

export function KanaSelector() {
    const { kanaTypes, toggleKanaType, characterType } = useAppSettingsStore();
    const isKanaMode = characterType === 'kana';

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
            <Tooltip title="Toggle Hiragana">
                <IconButton
                    onClick={() => toggleKanaType('hiragana')}
                    color={kanaTypes.has('hiragana') && isKanaMode ? "primary" : "inherit"}
                    size="small"
                    aria-label="Toggle Hiragana"
                    sx={{
                        fontFamily: 'sans-serif',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        opacity: isKanaMode ? 1 : 0.4,
                    }}
                >
                    あ
                </IconButton>
            </Tooltip>
            <Tooltip title="Toggle Katakana">
                <IconButton
                    onClick={() => toggleKanaType('katakana')}
                    color={kanaTypes.has('katakana') && isKanaMode ? "primary" : "inherit"}
                    size="small"
                    aria-label="Toggle Katakana"
                    sx={{
                        fontFamily: 'sans-serif',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        opacity: isKanaMode ? 1 : 0.4,
                    }}
                >
                    ア
                </IconButton>
            </Tooltip>
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
