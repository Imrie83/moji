import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { KanjiTile } from './KanjiTile';
import { kanji_n5 } from '../../data/kanji_n5';
import * as wanakana from 'wanakana';
import { useAppSettingsStore } from '../../store/appSettingsStore';

// Mock useMediaQuery
vi.mock('@mui/material', async () => {
    const actual = await vi.importActual('@mui/material');
    return {
        ...actual,
        useMediaQuery: vi.fn(),
    };
});

import { useMediaQuery } from '@mui/material';

// Select a few items for testing
const testCases = kanji_n5.slice(0, 3);

describe('KanjiTile', () => {
    beforeEach(() => {
        useAppSettingsStore.setState({ effectsLevel: 'standard' });
        vi.mocked(useMediaQuery).mockReturnValue(false); // Default to desktop
    });

    it.each(testCases)('renders kanji $character correctly', (kanji) => {
        render(<KanjiTile kanji={kanji} showReading={true} showMeaning={true} />);

        expect(screen.getByText(kanji.character)).toBeInTheDocument();
        expect(screen.getByText(wanakana.toHiragana(kanji.onyomi.join(', ')))).toBeInTheDocument();
        expect(screen.getByText(kanji.meaning.join(', '))).toBeInTheDocument();
    });

    it('hides reading and meaning by default', () => {
        const kanji = testCases[0];
        render(<KanjiTile kanji={kanji} />);
        expect(screen.getByText(kanji.character)).toBeInTheDocument();
        expect(screen.queryByText(wanakana.toHiragana(kanji.onyomi.join(', ')))).not.toBeInTheDocument();
        expect(screen.queryByText(kanji.meaning.join(', '))).not.toBeInTheDocument();
    });

    it('renders differently on mobile', () => {
        vi.mocked(useMediaQuery).mockReturnValue(true);
        const { getByTestId } = render(<KanjiTile kanji={testCases[0]} />);
        const tile = getByTestId('kanji-tile');
        // Mobile width is 85, desktop is 120
        expect(tile).toHaveStyle({ width: '85px' });
    });

    it('renders with "correct" status and standard effects', () => {
        const { getByTestId, queryByTestId } = render(
            <KanjiTile kanji={testCases[0]} status="correct" isAnimating={true} />
        );
        expect(getByTestId('kanji-tile')).toBeInTheDocument();
        // Should NOT render ParticlesEffect in standard mode
        expect(queryByTestId('mock-particles')).not.toBeInTheDocument();
    });

    it('renders with "correct" status and premium effects', () => {
        useAppSettingsStore.setState({ effectsLevel: 'premium' });
        // We need to mock ParticlesEffect because it's used in KanjiTile
        vi.mock('../ParticlesEffect/ParticlesEffect', () => ({
            ParticlesEffect: () => <div data-testid="mock-particles" />
        }));

        const { getByTestId } = render(
            <KanjiTile kanji={testCases[0]} status="correct" isAnimating={true} />
        );
        expect(getByTestId('mock-particles')).toBeInTheDocument();
    });

    it('renders with "incorrect" status and shake animation', () => {
        const { getByTestId } = render(
            <KanjiTile kanji={testCases[0]} status="incorrect" isAnimating={true} />
        );
        const tile = getByTestId('kanji-tile');
        // In standard mode, it uses CSS animation
        expect(tile).toHaveStyle({ animation: 'shake 0.4s ease-in-out' });
    });

    it('renders premium shake props when premium and incorrect', () => {
        useAppSettingsStore.setState({ effectsLevel: 'premium' });
        const { getByTestId } = render(
            <KanjiTile kanji={testCases[0]} status="incorrect" isAnimating={true} />
        );
        // MotionPaper should be present (tested indirectly via lack of CSS animation)
        const tile = getByTestId('kanji-tile');
        expect(tile).not.toHaveStyle({ animation: 'shake 0.4s ease-in-out' });
    });
});
