import { Dialog, DialogTitle, DialogContent, FormGroup, FormControlLabel, Switch, Box, Divider, Typography, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useAppSettingsStore, type ReadingMode } from '../../store/appSettingsStore';

interface SettingsDialogProps {
    readonly open: boolean;
    readonly onClose: () => void;
}

export function SettingsDialog({ open, onClose }: SettingsDialogProps) {
    const {
        showReading,
        showMeaning,
        showExpandedCard,
        practiceLimit,
        retryIncorrect,
        readingMode,
        characterType,
        setShowReading,
        setShowMeaning,
        setShowExpandedCard,
        setPracticeLimit,
        setRetryIncorrect,
        setReadingMode
    } = useAppSettingsStore();

    const handleReadingModeChange = (
        _event: React.MouseEvent<HTMLElement>,
        newMode: ReadingMode | null,
    ) => {
        if (newMode !== null) {
            setReadingMode(newMode);
        }
    };

    const handleLimitChange = (value: string) => {
        // Allow empty string or convert to number
        if (value === '') {
            setPracticeLimit(0);
        } else {
            const num = Number.parseInt(value, 10);
            if (!Number.isNaN(num) && num >= 0) {
                setPracticeLimit(num);
            }
        }
    };

    const isInfinityMode = practiceLimit === 0;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Settings</DialogTitle>
            <DialogContent>
                <Box sx={{ py: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                        Card Display Options
                    </Typography>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={showReading}
                                    onChange={(e) => setShowReading(e.target.checked)}
                                    data-testid="toggle-reading"
                                />
                            }
                            label="Show Reading (Furigana)"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={showMeaning}
                                    onChange={(e) => setShowMeaning(e.target.checked)}
                                    data-testid="toggle-meaning"
                                />
                            }
                            label="Show Meaning"
                        />
                        <Divider sx={{ my: 2 }} />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={showExpandedCard}
                                    onChange={(e) => setShowExpandedCard(e.target.checked)}
                                    data-testid="toggle-expanded-card"
                                />
                            }
                            label="Expanded Card View"
                        />
                    </FormGroup>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                        Practice Settings
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                            Accepted Readings
                        </Typography>
                        <ToggleButtonGroup
                            value={readingMode}
                            exclusive
                            onChange={handleReadingModeChange}
                            aria-label="reading mode"
                            fullWidth
                            size="small"
                            disabled={characterType !== 'kanji'}
                            sx={{
                                gap: 1,
                                '& .MuiToggleButtonGroup-grouped': {
                                    border: 1,
                                    borderColor: 'divider',
                                    borderRadius: '4px',
                                    '&:not(:first-of-type)': {
                                        borderRadius: '4px',
                                        borderLeft: 1,
                                        borderLeftColor: 'divider',
                                        marginLeft: 0,
                                    },
                                    '&:first-of-type': {
                                        borderRadius: '4px',
                                    },
                                }
                            }}
                        >
                            <ToggleButton value="onyomi" aria-label="onyomi only">
                                Onyomi
                            </ToggleButton>
                            <ToggleButton value="kunyomi" aria-label="kunyomi only">
                                Kunyomi
                            </ToggleButton>
                            <ToggleButton value="mixed" aria-label="both readings">
                                Both
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Number of Characters to Practice"
                            value={practiceLimit === 0 ? '' : practiceLimit}
                            onChange={(e) => handleLimitChange(e.target.value)}
                            type="text"
                            size="small"
                            fullWidth
                            placeholder="0 for continuous"
                            helperText="Enter 0 or leave empty for continuous practice"
                            slotProps={{
                                htmlInput: {
                                    'data-testid': 'practice-limit-input'
                                }
                            }}
                        />
                    </Box>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={retryIncorrect}
                                    onChange={(e) => setRetryIncorrect(e.target.checked)}
                                    disabled={isInfinityMode}
                                    data-testid="toggle-retry-incorrect"
                                />
                            }
                            label={
                                <Box>
                                    <Typography variant="body2">
                                        Retry Incorrect Answers
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {isInfinityMode
                                            ? '(Not available in infinity mode)'
                                            : 'Re-add incorrect answers to the queue'}
                                    </Typography>
                                </Box>
                            }
                        />
                    </FormGroup>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
