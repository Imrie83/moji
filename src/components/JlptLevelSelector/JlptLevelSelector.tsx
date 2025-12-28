import { IconButton, Box, Tooltip, Typography } from '@mui/material';
import { useAppSettingsStore, type JlptLevel } from '../../store/appSettingsStore';
import { useState } from 'react';
import { CharacterSelectionModal } from '../CharacterSelectionModal/CharacterSelectionModal';
import { kanji_n5 } from '../../data/kanji_n5';
import { kanji_n4 } from '../../data/kanji_n4';
import { kanji_n3 } from '../../data/kanji_n3';
import type { Kanji } from '../../interfaces/kanji';

const JLPT_LEVELS: JlptLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

// Map levels to their datasets
const KANJI_DATA: Record<JlptLevel, Kanji[]> = {
    'N5': kanji_n5,
    'N4': kanji_n4,
    'N3': kanji_n3,
    'N2': [], // Placeholder for now
    'N1': [], // Placeholder for now
};

export function JlptLevelSelector() {
    const { jlptLevels, setJlptLevel, characterType, excludedCharacters, toggleCharacterExclusion, setDatasetExclusions } = useAppSettingsStore();
    const isKanjiMode = characterType === 'kanji';
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState<JlptLevel | null>(null);

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedLevel(null);
    };

    const activeDataset = selectedLevel ? KANJI_DATA[selectedLevel] : [];

    const handleCharacterToggle = (char: string) => {
        if (!selectedLevel) return;

        const isCurrentlyExcluded = excludedCharacters.has(char);
        toggleCharacterExclusion(char);

        // Calculate active count by simulating the change on the stale excludedCharacters
        const currentExcludedCount = activeDataset.filter(k => excludedCharacters.has(k.character)).length;
        const newExcludedCount = isCurrentlyExcluded ? currentExcludedCount - 1 : currentExcludedCount + 1;

        const totalCount = activeDataset.length;
        const activeCount = totalCount - newExcludedCount;

        if (activeCount === 0) {
            setJlptLevel(selectedLevel, false);
        } else if (activeCount > 0 && (!jlptLevels.has(selectedLevel) || !isKanjiMode)) {
            setJlptLevel(selectedLevel, true);
        }
    };

    const handleToggleAll = (chars: string[], excluded: boolean) => {
        if (!selectedLevel) return;

        setDatasetExclusions(chars, excluded);

        // If we are EXCLUDING all (excluded=true), then active count becomes 0
        if (excluded) {
            setJlptLevel(selectedLevel, false);
        } else {
            // If we are INCLUDING all (excluded=false), active count > 0
            setJlptLevel(selectedLevel, true);
        }
    };

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
                <Tooltip key={level} title={`Manage ${level} Kanji`}>
                    <IconButton
                        onClick={() => {
                            // If there are active characters, strictly enable the level
                            const dataset = KANJI_DATA[level];
                            const activeCount = dataset.filter(k => !excludedCharacters.has(k.character)).length;
                            if (activeCount > 0) {
                                setJlptLevel(level, true);
                            }

                            setSelectedLevel(level);
                            setModalOpen(true);
                        }}
                        color={jlptLevels.has(level) && isKanjiMode ? "primary" : "inherit"}
                        size="small"
                        aria-label={`Toggle ${level}`}
                        disabled={(level === 'N1' || level === 'N2') && isKanjiMode && KANJI_DATA[level].length === 0}
                        sx={{
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            opacity: (jlptLevels.has(level) && isKanjiMode) ? 1 : 0.4,
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

            {/* Selection Modal */}
            {selectedLevel && (
                <CharacterSelectionModal
                    open={modalOpen}
                    onClose={handleCloseModal}
                    title={`${selectedLevel} Kanji Selection`}
                    description="Select which characters to include in your practice session."
                    items={activeDataset}
                    excludedItems={excludedCharacters}
                    onToggle={handleCharacterToggle}
                    onToggleAll={handleToggleAll}
                />
            )}
        </Box>
    );
}
