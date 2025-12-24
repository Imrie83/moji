import { create } from 'zustand';
import { PracticeMode } from '../interfaces/practiceMode';

export type Theme = 'light' | 'dark' | 'system';

export type VisualEffectsLevel = 'standard' | 'premium';

export type JlptLevel = 'N5' | 'N4' | 'N3';

export type CharacterType = 'kanji' | 'kana';

export type KanaType = 'hiragana' | 'katakana';

interface AppSettingsState {
    kanjiCurrentScore: number;
    kanjiTopScore: number;
    practiceMode: PracticeMode;
    theme: Theme;
    effectsLevel: VisualEffectsLevel;
    jlptLevels: Set<JlptLevel>;
    characterType: CharacterType;
    kanaTypes: Set<KanaType>;
    setKanjiCurrentScore: (score: number) => void;
    resetScores: () => void;
    setPracticeMode: (mode: PracticeMode) => void;
    setTheme: (theme: Theme) => void;
    setEffectsLevel: (level: VisualEffectsLevel) => void;
    toggleJlptLevel: (level: JlptLevel) => void;
    setCharacterType: (type: CharacterType) => void;
    toggleKanaType: (type: KanaType) => void;
}

export const useAppSettingsStore = create<AppSettingsState>()((set) => ({
    kanjiCurrentScore: 0,
    kanjiTopScore: 0,
    practiceMode: PracticeMode.None,
    theme: 'system',
    effectsLevel: 'standard',
    jlptLevels: new Set<JlptLevel>(['N5']),
    characterType: 'kanji',
    kanaTypes: new Set<KanaType>(),
    setKanjiCurrentScore: (score: number) =>
        set((state) => {
            // Prevent negative scores
            const validScore = Math.max(0, score);

            const newState: Partial<AppSettingsState> = {
                kanjiCurrentScore: validScore,
            };

            // Update top score only if current score is higher
            if (validScore > state.kanjiTopScore) {
                newState.kanjiTopScore = validScore;
            }

            return newState;
        }),

    resetScores: () => set({ kanjiCurrentScore: 0, kanjiTopScore: 0 }),

    setPracticeMode: (mode: PracticeMode) => set({ practiceMode: mode }),

    setTheme: (theme: Theme) => set({ theme }),

    setEffectsLevel: (level: VisualEffectsLevel) => set({ effectsLevel: level }),

    toggleJlptLevel: (level: JlptLevel) => set((state) => {
        const newLevels = new Set(state.jlptLevels);

        if (newLevels.has(level)) {
            // Only remove if there will be at least one level remaining
            if (newLevels.size > 1) {
                newLevels.delete(level);
                return { jlptLevels: newLevels };
            }
            // Don't update state if we can't remove the last level
            return {};
        } else {
            newLevels.add(level);
            // Switch to kanji mode when selecting a kanji level
            return {
                jlptLevels: newLevels,
                characterType: 'kanji'
            };
        }
    }),

    setCharacterType: (type: CharacterType) => set({ characterType: type }),

    toggleKanaType: (type: KanaType) => set((state) => {
        const newTypes = new Set(state.kanaTypes);

        if (newTypes.has(type)) {
            // Only remove if there will be at least one type remaining
            if (newTypes.size > 1) {
                newTypes.delete(type);
            }
        } else {
            newTypes.add(type);
        }

        // Switch to kana mode when selecting a kana type
        return {
            kanaTypes: newTypes,
            characterType: 'kana'
        };
    }),
}));
