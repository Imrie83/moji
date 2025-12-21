import { create } from 'zustand';
import { PracticeMode } from '../interfaces/practiceMode';

export type Theme = 'light' | 'dark' | 'system';

export type VisualEffectsLevel = 'standard' | 'premium';

interface AppSettingsState {
    kanjiCurrentScore: number;
    kanjiTopScore: number;
    practiceMode: PracticeMode;
    theme: Theme;
    effectsLevel: VisualEffectsLevel;
    setKanjiCurrentScore: (score: number) => void;
    resetScores: () => void;
    setPracticeMode: (mode: PracticeMode) => void;
    setTheme: (theme: Theme) => void;
    setEffectsLevel: (level: VisualEffectsLevel) => void;
}

export const useAppSettingsStore = create<AppSettingsState>()((set) => ({
    kanjiCurrentScore: 0,
    kanjiTopScore: 0,
    practiceMode: PracticeMode.None,
    theme: 'system',
    effectsLevel: 'standard',
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
}));
