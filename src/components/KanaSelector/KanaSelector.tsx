import { IconButton, Box, Tooltip, Typography } from '@mui/material';
import { useAppSettingsStore, type KanaType } from '../../store/appSettingsStore';
import { useState } from 'react';
import { CharacterSelectionModal } from '../CharacterSelectionModal/CharacterSelectionModal';
import { hiragana } from '../../data/hiragana';
import { katakana } from '../../data/katakana';
import type { Kana } from '../../interfaces/kana';

// Map types to their datasets (adapt Kana to common interface if needed, or Modal handles both)
// The modal expects (Kanji | Kana)[]. Kana interface has 'character', 'romaji', 'type'. Kanji has 'character', 'onyomi', etc.
// The modal only checks 'character'. So it's compatible.

const KANA_DATA: Record<KanaType, Kana[]> = {
    'hiragana': hiragana,
    'katakana': katakana,
};

export function KanaSelector() {
    const { kanaTypes, characterType, excludedCharacters, toggleCharacterExclusion, setDatasetExclusions, setKanaType } = useAppSettingsStore();
    const isKanaMode = characterType === 'kana';
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<KanaType | null>(null);

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedType(null);
    };

    const activeDataset = selectedType ? KANA_DATA[selectedType] : [];

    const handleCharacterToggle = (char: string) => {
        if (!selectedType) return;

        const isCurrentlyExcluded = excludedCharacters.has(char);
        toggleCharacterExclusion(char);

        // Calculate active count by simulating the change on the stale excludedCharacters
        const currentExcludedCount = activeDataset.filter(k => excludedCharacters.has(k.character)).length;
        const newExcludedCount = isCurrentlyExcluded ? currentExcludedCount - 1 : currentExcludedCount + 1;

        const totalCount = activeDataset.length;
        const activeCount = totalCount - newExcludedCount;

        if (activeCount === 0) {
            setKanaType(selectedType, false);
        } else if (activeCount > 0 && (!kanaTypes.has(selectedType) || !isKanaMode)) {
            setKanaType(selectedType, true);
        }
    };

    const handleToggleAll = (chars: string[], excluded: boolean) => {
        if (!selectedType) return;

        setDatasetExclusions(chars, excluded);

        if (excluded) {
            setKanaType(selectedType, false);
        } else {
            setKanaType(selectedType, true);
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
            <Tooltip title="Manage Hiragana">
                <IconButton
                    onClick={() => {
                        // Ensure Hiragana is active if chars are available
                        const dataset = KANA_DATA['hiragana'];
                        const activeCount = dataset.filter(k => !excludedCharacters.has(k.character)).length;
                        if (activeCount > 0) {
                            setKanaType('hiragana', true);
                        }

                        setSelectedType('hiragana');
                        setModalOpen(true);
                    }}
                    color={kanaTypes.has('hiragana') && isKanaMode ? "primary" : "inherit"}
                    size="small"
                    aria-label="Toggle Hiragana"
                    sx={{
                        fontFamily: 'sans-serif',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        opacity: (kanaTypes.has('hiragana') && isKanaMode) ? 1 : 0.4,
                    }}
                >
                    あ
                </IconButton>
            </Tooltip>
            <Tooltip title="Manage Katakana">
                <IconButton
                    onClick={() => {
                        // Ensure Katakana is active if chars are available
                        const dataset = KANA_DATA['katakana'];
                        const activeCount = dataset.filter(k => !excludedCharacters.has(k.character)).length;
                        if (activeCount > 0) {
                            setKanaType('katakana', true);
                        }

                        setSelectedType('katakana');
                        setModalOpen(true);
                    }}
                    color={kanaTypes.has('katakana') && isKanaMode ? "primary" : "inherit"}
                    size="small"
                    aria-label="Toggle Katakana"
                    sx={{
                        fontFamily: 'sans-serif',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        opacity: (kanaTypes.has('katakana') && isKanaMode) ? 1 : 0.4,
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

            {/* Selection Modal */}
            {selectedType && (
                <CharacterSelectionModal
                    open={modalOpen}
                    onClose={handleCloseModal}
                    title={`${selectedType === 'hiragana' ? 'Hiragana' : 'Katakana'} Selection`}
                    description="Select which characters to include in your practice session."
                    items={activeDataset}
                    excludedItems={excludedCharacters}
                    onToggle={handleCharacterToggle}
                    onToggleAll={handleToggleAll}
                    gridType="kana"
                />
            )}
        </Box>
    );
}
