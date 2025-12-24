import { create } from 'zustand';
import { PracticeMode } from '../interfaces/practiceMode';

export type Theme = 'light' | 'dark' | 'system';

export type VisualEffectsLevel = 'standard' | 'premium';

export type JlptLevel = 'N5' | 'N4' | 'N3';

interface AppSettingsState {
    kanjiCurrentScore: number;
    kanjiTopScore: number;
    practiceMode: PracticeMode;
    theme: Theme;
    effectsLevel: VisualEffectsLevel;
    jlptLevels: Set<JlptLevel>;
    setKanjiCurrentScore: (score: number) => void;
    resetScores: () => void;
    setPracticeMode: (mode: PracticeMode) => void;
    setTheme: (theme: Theme) => void;
    setEffectsLevel: (level: VisualEffectsLevel) => void;
    toggleJlptLevel: (level: JlptLevel) => void;
}

export const useAppSettingsStore = create<AppSettingsState>()((set) => ({
    kanjiCurrentScore: 0,
    kanjiTopScore: 0,
    practiceMode: PracticeMode.None,
    theme: 'system',
    effectsLevel: 'standard',
    jlptLevels: new Set<JlptLevel>(['N5']),
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
            return { jlptLevels: newLevels };
        }
    }),
}));
