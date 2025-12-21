import { describe, it, expect, beforeEach } from 'vitest';
import { useKanjiGameStore } from './kanjiGameStore';
import { useAppSettingsStore } from './appSettingsStore';
import type { Kanji } from '../interfaces/kanji';

// Mock data
const mockKanjiList: Kanji[] = [
    { character: 'A', onyomi: ['ON'], kunyomi: ['kun'], meaning: ['a'], level: 'N5' },
    { character: 'B', onyomi: ['BON'], kunyomi: ['bun'], meaning: ['b'], level: 'N5' }
];

describe('kanjiGameStore', () => {
    beforeEach(() => {
        useKanjiGameStore.getState().resetGame();
        useAppSettingsStore.getState().resetScores();
    });

    it('initializes game correctly', () => {
        const store = useKanjiGameStore.getState();
        store.initializeGame(mockKanjiList);

        const state = useKanjiGameStore.getState();
        expect(state.gameStatus).toBe('playing');
        expect(state.queue.length).toBeGreaterThan(0);
        expect(state.queue[0]).toBeDefined();

        // One will be reduced because initializeGame calls selectWeightedKanji multiple times
    });

    it('reduces weight of selected kanji', () => {
        const store = useKanjiGameStore.getState();
        store.initializeGame(mockKanjiList);

        const state = useKanjiGameStore.getState();
        const firstKanji = state.queue[0];
        if (!firstKanji) throw new Error('No kanji selected');

        const weightAfterPick = state.kanjiWeights[firstKanji.character];
        expect(weightAfterPick).toBeLessThan(100);
    });

    it('validates correct answer (Onyomi) and updates score', () => {
        const store = useKanjiGameStore.getState();
        store.initializeGame(mockKanjiList);

        // Force a specific kanji to test answer checking easily
        useKanjiGameStore.setState({
            queue: [{ ...mockKanjiList[0], onyomi: ['オン'] }],
            history: []
        });

        const result = store.checkAnswer('on'); // input 'on' -> 'おん'. 'オン' -> 'おん'. Match!

        expect(result).toBe(true);
        expect(useKanjiGameStore.getState().feedback).toBe('correct');

        // Before nextKanji, history should be empty and queue still has the item
        expect(useKanjiGameStore.getState().history.length).toBe(0);
        expect(useKanjiGameStore.getState().queue.length).toBe(1);

        // Call nextKanji to perform shift
        store.nextKanji(mockKanjiList);

        const state = useKanjiGameStore.getState();
        expect(state.history.length).toBe(1);
        expect(state.history[0].status).toBe('correct');
        expect(useAppSettingsStore.getState().kanjiCurrentScore).toBe(1);
    });

    it('rejects Kunyomi answer', () => {
        const store = useKanjiGameStore.getState();
        store.initializeGame(mockKanjiList);

        useKanjiGameStore.setState({
            queue: [{ ...mockKanjiList[0], onyomi: ['オン'], kunyomi: ['くん'] }],
            history: []
        });

        const result = store.checkAnswer('kun');

        expect(result).toBe(false);
        expect(useKanjiGameStore.getState().feedback).toBe('incorrect');

        store.nextKanji(mockKanjiList);

        const state = useKanjiGameStore.getState();
        expect(state.history.length).toBe(1);
        expect(state.history[0].status).toBe('incorrect');
        expect(useAppSettingsStore.getState().kanjiCurrentScore).toBe(0);
    });

    it('validates incorrect answer', () => {
        const store = useKanjiGameStore.getState();
        store.initializeGame(mockKanjiList);
        useKanjiGameStore.setState({
            queue: [mockKanjiList[0]],
            history: []
        });

        const result = store.checkAnswer('wrong');

        expect(result).toBe(false);
        expect(useKanjiGameStore.getState().feedback).toBe('incorrect');

        store.nextKanji(mockKanjiList);
        expect(useKanjiGameStore.getState().history.length).toBe(1);
        expect(useAppSettingsStore.getState().kanjiCurrentScore).toBe(0);
    });

    it('normalizes answer input with dots/forms', () => {
        const store = useKanjiGameStore.getState();
        const complexKanji: Kanji = { character: 'C', onyomi: ['セイ'], kunyomi: [], meaning: [], level: 'N5' };

        const check = (input: string) => {
            useKanjiGameStore.setState({ queue: [complexKanji], history: [] });
            return store.checkAnswer(input);
        };

        expect(check('sei')).toBe(true);
        expect(check('せい')).toBe(true);
        expect(check('セイ')).toBe(true);
    });
});
