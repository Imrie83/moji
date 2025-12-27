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
    practiceSet: Kanji[]; // Limited set when practicing with a limit
    retriedCharacters: Set<string>; // Track which characters have been retried

    // Actions
    initializeGame: (kanjiList: Kanji[], limit?: number) => void;
    nextKanji: () => void;
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
    practiceSet: [],
    retriedCharacters: new Set<string>(),

    initializeGame: (kanjiList: Kanji[], limit: number = 0) => {
        // Select a random subset if limit is set
        let selectedKanji = kanjiList;
        if (limit > 0) {
            const shuffled = [...kanjiList].sort(() => Math.random() - 0.5);
            selectedKanji = shuffled.slice(0, Math.min(limit, kanjiList.length));
        }

        const weights: Record<string, number> = {};
        selectedKanji.forEach(k => {
            weights[k.character] = INITIAL_WEIGHT;
        });

        // Initialize queue with weighted selection
        // When limit is set and < 6, show only that many tiles
        const queueSize = limit > 0 && limit < QUEUE_SIZE + 1 ? limit : QUEUE_SIZE + 1;
        const initialQueue: Kanji[] = [];
        let currentWeights = { ...weights };
        const selectedCharacters = new Set<string>();

        for (let i = 0; i < queueSize; i++) {
            // Filter out already selected characters to ensure uniqueness
            const availableKanji = selectedKanji.filter(k => !selectedCharacters.has(k.character));
            const selected = selectWeightedKanji(availableKanji, currentWeights);
            if (selected) {
                initialQueue.push(selected);
                selectedCharacters.add(selected.character);
                currentWeights[selected.character] = Math.max(MIN_WEIGHT, currentWeights[selected.character] * WEIGHT_DROP_FACTOR);
            }
        }

        set({
            kanjiWeights: currentWeights,
            gameStatus: 'playing',
            queue: initialQueue,
            history: [],
            practiceSet: selectedKanji,
            retriedCharacters: new Set<string>()
        });
    },

    nextKanji: () => {
        const { queue, history, feedback, kanjiWeights, practiceSet, retriedCharacters } = get();
        const appStore = useAppSettingsStore.getState();
        const { retryIncorrect, practiceLimit } = appStore;

        const currentKanji = queue[0];
        const isIncorrect = feedback === 'incorrect';
        const hasNotBeenRetried = !retriedCharacters.has(currentKanji.character);
        const shouldRetry = isIncorrect && retryIncorrect && practiceLimit > 0 && hasNotBeenRetried;

        // Move current to history IF we just came from a guess
        let newHistory = history;
        if (feedback !== 'none') {
            const historyItem: KanjiHistoryItem = {
                kanji: currentKanji,
                status: feedback === 'correct' ? 'correct' : 'incorrect'
            };
            newHistory = [...history, historyItem].slice(-HISTORY_SIZE);
        }

        let remainingQueue = feedback !== 'none' ? queue.slice(1) : queue;
        let newRetriedCharacters = new Set(retriedCharacters);

        // If we should retry an incorrect answer, insert it back at a random position
        if (shouldRetry) {
            const randomIndex = Math.floor(Math.random() * remainingQueue.length);
            remainingQueue = [
                ...remainingQueue.slice(0, randomIndex),
                currentKanji,
                ...remainingQueue.slice(randomIndex)
            ];
            newRetriedCharacters.add(currentKanji.character);
        }

        // Only add new characters if in infinity mode (limit = 0)
        // When practice limit is set, work only with the initial set
        const appStoreForCheck = useAppSettingsStore.getState();
        const shouldAddNewCharacter = appStoreForCheck.practiceLimit === 0;

        if (shouldAddNewCharacter) {
            // Weighted Random Selection for the NEW item to add at the end
            const kanjiList = practiceSet.length > 0 ? practiceSet : [];
            const selectedKanji = selectWeightedKanji(kanjiList, kanjiWeights);

            if (selectedKanji) {
                const newWeights = { ...kanjiWeights };
                newWeights[selectedKanji.character] = Math.max(MIN_WEIGHT, newWeights[selectedKanji.character] * WEIGHT_DROP_FACTOR);

                set({
                    kanjiWeights: newWeights,
                    queue: [...remainingQueue, selectedKanji],
                    history: newHistory,
                    feedback: 'none',
                    userInput: '',
                    retriedCharacters: newRetriedCharacters
                });
                return;
            }
        }

        // If not adding new character, just update state
        set({
            queue: remainingQueue,
            history: newHistory,
            feedback: 'none',
            userInput: '',
            retriedCharacters: newRetriedCharacters
        });
    },

    checkAnswer: (input: string) => {
        const { queue } = get();
        if (queue.length === 0) return false;

        const currentKanji = queue[0];
        const appStore = useAppSettingsStore.getState();
        const { readingMode } = appStore;

        const normalize = (s: string) => toHiragana(s.replaceAll(/[.-]/g, ''), { convertLongVowelMark: true });
        const cleanInput = normalize(input.trim());

        let validReadings: string[] = [];
        if (readingMode === 'onyomi') {
            validReadings = currentKanji.onyomi;
        } else if (readingMode === 'kunyomi') {
            validReadings = currentKanji.kunyomi;
        } else {
            validReadings = [...currentKanji.onyomi, ...currentKanji.kunyomi];
        }

        const isCorrect = validReadings.some(reading => normalize(reading) === cleanInput);

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

    return availableKanji.at(-1) || null;
}
