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
        expect(state.currentKanji).toBeDefined();

        // Weights should be initialized
        // One will be reduced because nextKanji is called immediately
        const reducedWeight = 100 * 0.3;
        const weightA = state.kanjiWeights['A'];
        const weightB = state.kanjiWeights['B'];

        // Either A or B is selected
        if (state.currentKanji?.character === 'A') {
            expect(weightA).toBe(reducedWeight);
            expect(weightB).toBe(100);
        } else {
            expect(weightA).toBe(100);
            expect(weightB).toBe(reducedWeight);
        }
    });

    it('reduces weight of selected kanji', () => {
        const store = useKanjiGameStore.getState();
        store.initializeGame(mockKanjiList);

        const firstKanji = useKanjiGameStore.getState().currentKanji;
        if (!firstKanji) throw new Error('No kanji selected');

        const weightAfterFirstPick = useKanjiGameStore.getState().kanjiWeights[firstKanji.character];
        expect(weightAfterFirstPick).toBe(30);

        const otherKanjiChar = mockKanjiList.find(k => k.character !== firstKanji.character)?.character;
        if (otherKanjiChar) {
            expect(useKanjiGameStore.getState().kanjiWeights[otherKanjiChar]).toBe(100);
        }
    });

    it('validates correct answer (Onyomi) and updates score', () => {
        const store = useKanjiGameStore.getState();
        store.initializeGame(mockKanjiList);

        // Force a specific kanji to test answer checking easily
        useKanjiGameStore.setState({ currentKanji: mockKanjiList[0] }); // Character 'A', onyomi 'ON'

        // Check Onyomi (case insensitive/script insensitive hopefully handled by wanakana later, but for now exact match or hiragana normalized)
        // Our mock is 'ON' (uppercase romaji? usually katakana in real data).
        // Let's assume input comes as normalized string or check implementation.
        // The implementation uses toHiragana. 'ON' -> 'おん'.
        const result = store.checkAnswer('on'); // wanakana toHiragana('on') -> 'おん'
        // Wait, 'ON' in mock data is uppercase. wanakana.toHiragana('ON') -> 'OK'. No wait.
        // wanakana.toHiragana('ON') -> 'おん' if configured? No, standard is romaji->kana.
        // If the data has 'ON', and we type 'on', both become 'おん'? 
        // Real kanji data has Katakana: ['アン']. 
        // If I type 'an', toHiragana('an') -> 'あん'. 
        // toHiragana('アン') -> 'あん'.
        // So they match.
        // But here my mock data has 'ON' (romaji). toHiragana('ON') -> 'おん'.

        // Let's update mock to contain Katakana to be realistic
        useKanjiGameStore.setState({
            currentKanji: { ...mockKanjiList[0], onyomi: ['オン'] }
        });

        const result2 = store.checkAnswer('on'); // input 'on' -> 'おん'. 'オン' -> 'おん'. Match!

        expect(result2).toBe(true);
        expect(useKanjiGameStore.getState().feedback).toBe('correct');
        expect(useAppSettingsStore.getState().kanjiCurrentScore).toBe(2);
    });

    it('rejects Kunyomi answer', () => {
        const store = useKanjiGameStore.getState();
        store.initializeGame(mockKanjiList);

        useKanjiGameStore.setState({
            currentKanji: { ...mockKanjiList[0], onyomi: ['オン'], kunyomi: ['くん'] }
        });

        const result = store.checkAnswer('kun'); // 'kun' -> 'くん'. Matches kunyomi but should fail.

        expect(result).toBe(false);
        expect(useKanjiGameStore.getState().feedback).toBe('incorrect');
        expect(useAppSettingsStore.getState().kanjiCurrentScore).toBe(0);
    });

    it('validates incorrect answer', () => {
        const store = useKanjiGameStore.getState();
        store.initializeGame(mockKanjiList);
        useKanjiGameStore.setState({ currentKanji: mockKanjiList[0] });

        const result = store.checkAnswer('wrong');

        expect(result).toBe(false);
        expect(useKanjiGameStore.getState().feedback).toBe('incorrect');
        expect(useAppSettingsStore.getState().kanjiCurrentScore).toBe(0);
    });

    it('normalizes answer input with dots/forms', () => {
        const store = useKanjiGameStore.getState();
        store.initializeGame(mockKanjiList);

        const complexKanji: Kanji = { character: 'C', onyomi: ['セイ'], kunyomi: [], meaning: [], level: 'N5' };
        useKanjiGameStore.setState({ currentKanji: complexKanji });

        // Input 'sei' -> 'せい', 'セイ' -> 'せい'. Match.
        expect(store.checkAnswer('sei')).toBe(true);
        expect(store.checkAnswer('せい')).toBe(true);
        expect(store.checkAnswer('セイ')).toBe(true);
    });
});
