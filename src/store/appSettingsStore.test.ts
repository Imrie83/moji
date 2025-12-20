import { describe, it, expect, beforeEach } from 'vitest';
import { useAppSettingsStore } from './appSettingsStore';
import { PracticeMode } from '../interfaces/practiceMode';

describe('appSettingsStore', () => {
    beforeEach(() => {
        useAppSettingsStore.setState({
            kanjiCurrentScore: 0,
            kanjiTopScore: 0,
        });
    });

    describe('setKanjiCurrentScore', () => {
        it('should set the current score', () => {
            const { setKanjiCurrentScore } = useAppSettingsStore.getState();

            setKanjiCurrentScore(10);

            expect(useAppSettingsStore.getState().kanjiCurrentScore).toBe(10);
        });

        it('should update top score when current score is higher than top score', () => {
            const { setKanjiCurrentScore } = useAppSettingsStore.getState();

            setKanjiCurrentScore(15);

            expect(useAppSettingsStore.getState().kanjiCurrentScore).toBe(15);
            expect(useAppSettingsStore.getState().kanjiTopScore).toBe(15);
        });

        it('should NOT update top score when current score is lower than top score', () => {
            const { setKanjiCurrentScore } = useAppSettingsStore.getState();

            // First set a high score
            setKanjiCurrentScore(20);
            expect(useAppSettingsStore.getState().kanjiTopScore).toBe(20);

            // Then set a lower score
            setKanjiCurrentScore(10);

            expect(useAppSettingsStore.getState().kanjiCurrentScore).toBe(10);
            expect(useAppSettingsStore.getState().kanjiTopScore).toBe(20); // Should remain unchanged
        });

        it('should handle multiple score updates correctly', () => {
            const { setKanjiCurrentScore } = useAppSettingsStore.getState();

            setKanjiCurrentScore(5);
            expect(useAppSettingsStore.getState().kanjiTopScore).toBe(5);

            setKanjiCurrentScore(3);
            expect(useAppSettingsStore.getState().kanjiTopScore).toBe(5);

            setKanjiCurrentScore(10);
            expect(useAppSettingsStore.getState().kanjiTopScore).toBe(10);

            setKanjiCurrentScore(7);
            expect(useAppSettingsStore.getState().kanjiTopScore).toBe(10);
        });

        it('should handle zero scores and prevent negative scores', () => {
            const { setKanjiCurrentScore } = useAppSettingsStore.getState();

            setKanjiCurrentScore(10);
            expect(useAppSettingsStore.getState().kanjiTopScore).toBe(10);

            setKanjiCurrentScore(0);
            expect(useAppSettingsStore.getState().kanjiCurrentScore).toBe(0);
            expect(useAppSettingsStore.getState().kanjiTopScore).toBe(10);

            // Negative scores should be clamped to 0
            setKanjiCurrentScore(-5);
            expect(useAppSettingsStore.getState().kanjiCurrentScore).toBe(0);
            expect(useAppSettingsStore.getState().kanjiTopScore).toBe(10);
        });
    });

    describe('resetScores', () => {
        it('should reset both scores to 0', () => {
            const { setKanjiCurrentScore, resetScores } = useAppSettingsStore.getState();

            setKanjiCurrentScore(50);
            expect(useAppSettingsStore.getState().kanjiCurrentScore).toBe(50);
            expect(useAppSettingsStore.getState().kanjiTopScore).toBe(50);

            resetScores();

            expect(useAppSettingsStore.getState().kanjiCurrentScore).toBe(0);
            expect(useAppSettingsStore.getState().kanjiTopScore).toBe(0);
        });
    });

    describe('setPracticeMode', () => {
        it('should set practiceMode', () => {
            const { setPracticeMode } = useAppSettingsStore.getState();

            setPracticeMode(PracticeMode.KanjiPractice);
            expect(useAppSettingsStore.getState().practiceMode).toBe(PracticeMode.KanjiPractice);
        });
    });

    describe('setTheme', () => {
        it('should default to system theme', () => {
            expect(useAppSettingsStore.getState().theme).toBe('system');
        });

        it('should set theme to light', () => {
            const { setTheme } = useAppSettingsStore.getState();

            setTheme('light');
            expect(useAppSettingsStore.getState().theme).toBe('light');
        });

        it('should set theme to dark', () => {
            const { setTheme } = useAppSettingsStore.getState();

            setTheme('dark');
            expect(useAppSettingsStore.getState().theme).toBe('dark');
        });

        it('should set theme to system', () => {
            const { setTheme } = useAppSettingsStore.getState();

            setTheme('light');
            expect(useAppSettingsStore.getState().theme).toBe('light');

            setTheme('system');
            expect(useAppSettingsStore.getState().theme).toBe('system');
        });
    });
});
