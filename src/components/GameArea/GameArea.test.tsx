import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GameArea } from './GameArea';
import { useKanjiGameStore } from '../../store/kanjiGameStore';
import { vi, describe, it, expect, beforeEach } from 'vitest';

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
        const store = useKanjiGameStore.getState();
        store.resetGame();

        render(<GameArea />);
    });

    it('renders scores and kanji tile', async () => {
        expect(screen.getByText('Current Score')).toBeInTheDocument();
        expect(screen.getByText('Top Score')).toBeInTheDocument();

        // Should show one of the kanji
        // Since we can't control random easily without mocking Math.random (which we could do),
        // we just check if any of the mock characters appear.
        const kanjiElement = screen.getByTestId('kanji-tile');
        expect(kanjiElement).toBeInTheDocument();
        expect(kanjiElement).toHaveTextContent(/[安一飲]/);
    });

    it('updates score on correct answer', async () => {
        const input = screen.getByRole('textbox') as HTMLInputElement;

        // Find which kanji is displayed to provide correct answer
        const displayedText = screen.getByTestId('kanji-tile').textContent || '';
        const targetKanji = mockKanjiList.find(k => displayedText.includes(k.character));
        const correctAnswer = targetKanji?.onyomi[0] || '';

        fireEvent.change(input, { target: { value: correctAnswer } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        // Score should increase (requires store integration check or UI check)
        // Store updates async? No, synchronous usually.
        // But UI might wait.

        await waitFor(() => {
            // "1" if started at 0
            expect(screen.getAllByText('1', { selector: 'h4' })).toHaveLength(2);
        });
    });

    it('shows error on incorrect answer', async () => {
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'wrong' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        await waitFor(() => {
            expect(screen.getByText('Try again!')).toBeInTheDocument();
        });
    });
});
