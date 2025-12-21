import { render, screen, fireEvent } from '@testing-library/react';
import { GameArea } from './GameArea';
import { useKanjiGameStore } from '../../store/kanjiGameStore';
import { useAppSettingsStore } from '../../store/appSettingsStore';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock wanakana
vi.mock('wanakana', () => ({
    bind: vi.fn(),
    unbind: vi.fn(),
    toHiragana: vi.fn((val) => val),
}));

const { mockKanjiList } = vi.hoisted(() => {
    return {
        mockKanjiList: [
            { character: '安', onyomi: ['アン'], kunyomi: ['やす.い'], meaning: ['relax', 'cheap'], level: 'N5' },
            { character: '一', onyomi: ['イチ', 'イツ'], kunyomi: ['ひと-', 'ひと.つ'], meaning: ['one'], level: 'N5' },
            { character: '飲', onyomi: ['イン', 'オン'], kunyomi: ['の.む'], meaning: ['drink'], level: 'N5' }
        ]
    };
});

vi.mock('../../data/kanji_n5', () => ({
    kanji_n5: mockKanjiList
}));

describe('GameArea', () => {
    beforeEach(() => {
        useKanjiGameStore.getState().resetGame();
        useAppSettingsStore.getState().resetScores();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders scores and kanji tiles', async () => {
        render(<GameArea />);
        vi.advanceTimersByTime(0);

        expect(screen.getByText('Current Score')).toBeInTheDocument();
        expect(screen.getByText('Top Score')).toBeInTheDocument();

        const tiles = screen.getAllByTestId('kanji-tile');
        expect(tiles.length).toBeGreaterThan(0);
        expect(screen.getByTestId('game-area')).toHaveTextContent(/[安一飲]/);
    });

    it('updates score on correct answer', async () => {
        render(<GameArea />);
        vi.advanceTimersByTime(0);

        const input = screen.getByRole('textbox') as HTMLInputElement;
        const currentKanji = useKanjiGameStore.getState().queue[0];
        const correctAnswer = currentKanji.onyomi[0];

        fireEvent.input(input, { target: { value: correctAnswer } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        // Both Current Score and Top Score should show '1'
        // We look for '1' inside h4 elements
        const scoreElements = screen.queryAllByText('1', { selector: 'h4' });
        expect(scoreElements.length).toBe(2);

        vi.advanceTimersByTime(250);
        expect(useKanjiGameStore.getState().feedback).toBe('none');
    });
});
