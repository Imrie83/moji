import { create } from 'zustand';
import type { Kanji } from '../interfaces/kanji';
import { useAppSettingsStore } from './appSettingsStore';
import { toHiragana } from 'wanakana';

interface KanjiHistoryItem {
    kanji: Kanji;
    status: 'correct' | 'incorrect';
}

interface KanjiGameState {
    queue: Kanji[];
    history: KanjiHistoryItem[];
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
const WEIGHT_DROP_FACTOR = 0.3;
const MIN_WEIGHT = 1;
const QUEUE_SIZE = 5;
const HISTORY_SIZE = 5;

export const useKanjiGameStore = create<KanjiGameState>((set, get) => ({
    queue: [],
    history: [],
    kanjiWeights: {},
    gameStatus: 'idle',
    feedback: 'none',
    userInput: '',

    initializeGame: (kanjiList: Kanji[]) => {
        const weights: Record<string, number> = {};
        kanjiList.forEach(k => {
            weights[k.character] = INITIAL_WEIGHT;
        });

        // Initialize queue with weighted selection
        const initialQueue: Kanji[] = [];
        let currentWeights = { ...weights };

        for (let i = 0; i < QUEUE_SIZE + 1; i++) { // Current + 5 in queue
            const selected = selectWeightedKanji(kanjiList, currentWeights);
            if (selected) {
                initialQueue.push(selected);
                currentWeights[selected.character] = Math.max(MIN_WEIGHT, currentWeights[selected.character] * WEIGHT_DROP_FACTOR);
            }
        }

        set({
            kanjiWeights: currentWeights,
            gameStatus: 'playing',
            queue: initialQueue,
            history: []
        });
    },

    nextKanji: (kanjiList: Kanji[]) => {
        const { queue, history, feedback, kanjiWeights } = get();

        const currentKanji = queue[0];

        // Move current to history IF we just came from a guess
        let newHistory = history;
        if (feedback !== 'none') {
            const historyItem: KanjiHistoryItem = {
                kanji: currentKanji,
                status: feedback === 'correct' ? 'correct' : 'incorrect'
            };
            newHistory = [...history, historyItem].slice(-HISTORY_SIZE);
        }

        const remainingQueue = feedback !== 'none' ? queue.slice(1) : queue;

        // Weighted Random Selection for the NEW item to add at the end
        const selectedKanji = selectWeightedKanji(kanjiList, kanjiWeights);

        if (selectedKanji) {
            const newWeights = { ...kanjiWeights };
            newWeights[selectedKanji.character] = Math.max(MIN_WEIGHT, newWeights[selectedKanji.character] * WEIGHT_DROP_FACTOR);

            set({
                kanjiWeights: newWeights,
                queue: [...remainingQueue, selectedKanji],
                history: newHistory,
                feedback: 'none',
                userInput: ''
            });
        }
    },

    checkAnswer: (input: string) => {
        const { queue } = get();
        if (queue.length === 0) return false;

        const currentKanji = queue[0];
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
        queue: [],
        history: [],
        gameStatus: 'idle',
        feedback: 'none',
        userInput: ''
    })
}));

// Helper for weighted selection
function selectWeightedKanji(kanjiList: Kanji[], weights: Record<string, number>): Kanji | null {
    let totalWeight = 0;
    const availableKanji = kanjiList.filter(k => weights[k.character] !== undefined);

    availableKanji.forEach(k => {
        totalWeight += weights[k.character];
    });

    if (totalWeight === 0) return null;

    let randomVal = Math.random() * totalWeight;
    for (const k of availableKanji) {
        randomVal -= weights[k.character];
        if (randomVal <= 0) {
            return k;
        }
    }

    return availableKanji[availableKanji.length - 1] || null;
}
