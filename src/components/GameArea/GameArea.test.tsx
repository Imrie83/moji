import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GameArea } from './GameArea';
import { useKanjiGameStore } from '../../store/kanjiGameStore';
import { useAppSettingsStore } from '../../store/appSettingsStore';
import { userEvent } from '@testing-library/user-event';

// Mock useMediaQuery
vi.mock('@mui/material', async () => {
    const actual = await vi.importActual('@mui/material');
    return {
        ...actual,
        useMediaQuery: vi.fn(),
    };
});

import { useMediaQuery } from '@mui/material';

describe('GameArea', () => {
    beforeEach(() => {
        useKanjiGameStore.getState().resetGame();
        useAppSettingsStore.getState().resetScores();
        vi.mocked(useMediaQuery).mockReturnValue(false);
    });

    it('initializes game on mount', () => {
        render(<GameArea />);
        expect(useKanjiGameStore.getState().queue.length).toBeGreaterThan(0);
    });

    it('displays loading state if queue is empty', () => {
        // Mock queue to be empty and handle initializeGame to prevent immediate populate
        const originalInit = useKanjiGameStore.getState().initializeGame;
        useKanjiGameStore.getState().initializeGame = vi.fn();
        useKanjiGameStore.setState({ queue: [] });

        render(<GameArea />);
        expect(screen.getByText(/loading/i)).toBeInTheDocument();

        useKanjiGameStore.getState().initializeGame = originalInit;
    });

    it('submits answer and handles transition', async () => {
        const user = userEvent.setup();
        render(<GameArea />);

        const input = screen.getByPlaceholderText(/type romaji/i);
        await user.type(input, 'てst{Enter}');

        // Should be transitioning
        expect(input).toBeDisabled();

        // After delay it should be enabled again
        await waitFor(() => expect(input).not.toBeDisabled(), { timeout: 2000 });
    });

    it('shows incorrect feedback message', () => {
        useKanjiGameStore.setState({ feedback: 'incorrect' });
        render(<GameArea />);

        expect(screen.getByText(/incorrect! the reading was:/i)).toBeInTheDocument();
    });

    it('displays scores correctly', () => {
        useAppSettingsStore.setState({ kanjiCurrentScore: 10, kanjiTopScore: 20 });
        render(<GameArea />);

        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('20')).toBeInTheDocument();
    });

    it('renders history and upcoming tiles', () => {
        const kanji = { character: 'test', onyomi: [], kunyomi: [], meaning: [], level: 'N5' } as any;
        useKanjiGameStore.setState({
            history: [{ kanji, status: 'correct' }],
            queue: [kanji, kanji]
        });

        render(<GameArea />);
        // Should render current, upcoming, and history
        expect(screen.getAllByTestId('kanji-tile').length).toBeGreaterThanOrEqual(2);
    });

    it('adjusts tile style on mobile', () => {
        vi.mocked(useMediaQuery).mockReturnValue(true);
        render(<GameArea />);
        expect(screen.getByTestId('game-area')).toBeInTheDocument();
    });

    it('prevents multiple submissions while transitioning', async () => {
        const user = userEvent.setup();
        const checkAnswerSpy = vi.spyOn(useKanjiGameStore.getState(), 'checkAnswer');
        render(<GameArea />);

        const input = screen.getByPlaceholderText(/type romaji/i);

        await user.type(input, 'a{Enter}');
        expect(checkAnswerSpy).toHaveBeenCalledTimes(1);
        expect(input).toBeDisabled();
    });
});
