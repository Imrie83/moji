import { create } from 'zustand';
import { PracticeMode } from '../interfaces/practiceMode';

export type Theme = 'light' | 'dark' | 'system';

export type VisualEffectsLevel = 'standard' | 'premium';

export type JlptLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export type CharacterType = 'kanji' | 'kana';

export type KanaType = 'hiragana' | 'katakana';

export type ReadingMode = 'onyomi' | 'kunyomi' | 'mixed';

interface AppSettingsState {
    kanjiCurrentScore: number;
    kanjiTopScore: number;
    practiceMode: PracticeMode;
    theme: Theme;
    effectsLevel: VisualEffectsLevel;
    jlptLevels: Set<JlptLevel>;
    characterType: CharacterType;
    kanaTypes: Set<KanaType>;
    excludedCharacters: Set<string>;
    // Display settings
    showReading: boolean;
    showMeaning: boolean;
    showExpandedCard: boolean;
    // Practice settings
    practiceLimit: number; // 0 = infinity
    retryIncorrect: boolean;
    readingMode: ReadingMode;
    setKanjiCurrentScore: (score: number) => void;
    resetScores: () => void;
    setPracticeMode: (mode: PracticeMode) => void;
    setTheme: (theme: Theme) => void;
    setEffectsLevel: (level: VisualEffectsLevel) => void;
    toggleJlptLevel: (level: JlptLevel) => void;
    setJlptLevel: (level: JlptLevel, active: boolean) => void;
    setCharacterType: (type: CharacterType) => void;
    toggleKanaType: (type: KanaType) => void;
    setKanaType: (type: KanaType, active: boolean) => void;
    toggleCharacterExclusion: (char: string) => void;
    setDatasetExclusions: (chars: string[], excluded: boolean) => void;
    setShowReading: (show: boolean) => void;
    setShowMeaning: (show: boolean) => void;
    setShowExpandedCard: (show: boolean) => void;
    setPracticeLimit: (limit: number) => void;
    setRetryIncorrect: (retry: boolean) => void;
    setReadingMode: (mode: ReadingMode) => void;
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
    excludedCharacters: new Set<string>(),
    // Display settings defaults
    showReading: false,
    showMeaning: false,
    showExpandedCard: false,
    // Practice settings defaults
    practiceLimit: 0, // 0 = infinity
    retryIncorrect: true,
    readingMode: 'onyomi',
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
            newLevels.delete(level);
            // If we remove the last level, we just have an empty set.
            // GameArea will handle empty state.
            return {
                jlptLevels: newLevels,
                // Only switch if we are actively modifying levels, though if we empty it, 
                // we might still want to stay in kanji mode or not. 
                // Let's keep existing behavior of switching to kanji mode on interaction.
                characterType: 'kanji'
            };
        } else {
            newLevels.add(level);
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
            newTypes.delete(type);
        } else {
            newTypes.add(type);
        }

        return {
            kanaTypes: newTypes,
            characterType: 'kana'
        };
    }),

    setJlptLevel: (level: JlptLevel, active: boolean) => set((state) => {
        const newLevels = new Set(state.jlptLevels);
        if (active) {
            newLevels.add(level);
            return { jlptLevels: newLevels, characterType: 'kanji' };
        } else {
            newLevels.delete(level);
            return { jlptLevels: newLevels };
        }
    }),

    setKanaType: (type: KanaType, active: boolean) => set((state) => {
        const newTypes = new Set(state.kanaTypes);
        if (active) {
            newTypes.add(type);
            return { kanaTypes: newTypes, characterType: 'kana' };
        } else {
            newTypes.delete(type);
            return { kanaTypes: newTypes };
        }
    }),

    toggleCharacterExclusion: (char: string) => set((state) => {
        const newExcluded = new Set(state.excludedCharacters);
        if (newExcluded.has(char)) {
            newExcluded.delete(char);
        } else {
            newExcluded.add(char);
        }
        return { excludedCharacters: newExcluded };
    }),

    setDatasetExclusions: (chars: string[], excluded: boolean) => set((state) => {
        const newExcluded = new Set(state.excludedCharacters);
        if (excluded) {
            chars.forEach(c => newExcluded.add(c));
        } else {
            chars.forEach(c => newExcluded.delete(c));
        }
        return { excludedCharacters: newExcluded };
    }),

    setShowReading: (show: boolean) => set({ showReading: show }),

    setShowMeaning: (show: boolean) => set({ showMeaning: show }),

    setShowExpandedCard: (show: boolean) => set({ showExpandedCard: show }),

    setPracticeLimit: (limit: number) => set({ practiceLimit: Math.max(0, limit) }),

    setRetryIncorrect: (retry: boolean) => set({ retryIncorrect: retry }),

    setReadingMode: (mode: ReadingMode) => set({ readingMode: mode }),
}));
