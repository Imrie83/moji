import { create } from 'zustand';
import type { Kanji } from '../interfaces/kanji';
import { useAppSettingsStore } from './appSettingsStore';
import { toHiragana } from 'wanakana';

interface KanjiGameState {
    currentKanji: Kanji | null;
    kanjiWeights: Record<string, number>;
    gameStatus: 'idle' | 'playing';
    feedback: 'correct' | 'incorrect' | 'none';
    userInput: string;

    // Actions
    initializeGame: (kanjiList: Kanji[]) => void;
    nextKanji: (kanjiList: Kanji[]) => void;
    checkAnswer: (input: string) => boolean;
    setUserInput: (input: string) => void;
    resetGame: () => void;
}

const INITIAL_WEIGHT = 100;
const WEIGHT_DROP_FACTOR = 0.3; // Weight drops to 30% after being picked
const MIN_WEIGHT = 1;

export const useKanjiGameStore = create<KanjiGameState>((set, get) => ({
    currentKanji: null,
    kanjiWeights: {},
    gameStatus: 'idle',
    feedback: 'none',
    userInput: '',

    initializeGame: (kanjiList: Kanji[]) => {
        const weights: Record<string, number> = {};
        kanjiList.forEach(k => {
            weights[k.character] = INITIAL_WEIGHT;
        });
        set({ kanjiWeights: weights, gameStatus: 'playing' });
        get().nextKanji(kanjiList);
    },

    nextKanji: (kanjiList: Kanji[]) => {
        const { kanjiWeights } = get();

        // Ensure we have weights
        if (Object.keys(kanjiWeights).length === 0) {
            get().initializeGame(kanjiList);
            return;
        }

        // Weighted Random Selection
        let totalWeight = 0;
        const availableKanji = kanjiList.filter(k => kanjiWeights[k.character] !== undefined);

        availableKanji.forEach(k => {
            totalWeight += kanjiWeights[k.character];
        });

        let randomVal = Math.random() * totalWeight;
        let selectedKanji: Kanji | null = null;

        for (const k of availableKanji) {
            randomVal -= kanjiWeights[k.character];
            if (randomVal <= 0) {
                selectedKanji = k;
                break;
            }
        }

        // Fallback (should rare happen unless rounding errors)
        if (!selectedKanji && availableKanji.length > 0) {
            selectedKanji = availableKanji[availableKanji.length - 1];
        }

        if (selectedKanji) {
            // Update weights
            const newWeights = { ...kanjiWeights };

            // Reduce weight of selected
            newWeights[selectedKanji.character] = Math.max(MIN_WEIGHT, newWeights[selectedKanji.character] * WEIGHT_DROP_FACTOR);

            // Slightly recover others (optional, keeps distribution dynamic)
            /* 
               We could iterate all others and multiply by RECOVERY_RATE, 
               but just reducing the picked one increases relative prob of others.
               Let's stick to simple reduction for now as requested.
            */

            set({
                currentKanji: selectedKanji,
                kanjiWeights: newWeights,
                feedback: 'none',
                userInput: ''
            });
        }
    },

    checkAnswer: (input: string) => {
        const { currentKanji } = get();
        if (!currentKanji) return false;
        const normalize = (s: string) => toHiragana(s.replace(/[.-]/g, ''), { convertLongVowelMark: true });

        const cleanInput = normalize(input.trim());
        const isCorrect = currentKanji.onyomi.some(reading => normalize(reading) === cleanInput);

        const appStore = useAppSettingsStore.getState();

        if (isCorrect) {
            set({ feedback: 'correct' });
            appStore.setKanjiCurrentScore(appStore.kanjiCurrentScore + 1);
            return true;
        } else {
            set({ feedback: 'incorrect' });
            appStore.setKanjiCurrentScore(0);
            return false;
        }
    },

    setUserInput: (input: string) => set({ userInput: input }),

    resetGame: () => set({
        currentKanji: null,
        gameStatus: 'idle',
        feedback: 'none',
        userInput: ''
    })
}));
