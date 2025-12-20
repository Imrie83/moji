import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KanjiTile } from './KanjiTile';
import { kanji_n5 } from '../../data/kanji_n5';

// Select a few items for testing
const testCases = kanji_n5.slice(0, 3);

describe('KanjiTile', () => {
    it.each(testCases)('renders kanji $character correctly', (kanji) => {
        render(<KanjiTile kanji={kanji} showReading={true} showMeaning={true} />);

        expect(screen.getByText(kanji.character)).toBeInTheDocument();
        // Check reading (kunyomi joined)
        expect(screen.getByText(kanji.kunyomi.join(', '))).toBeInTheDocument();
        // Check meaning (joined)
        expect(screen.getByText(kanji.meaning.join(', '))).toBeInTheDocument();
    });

    it('hides reading and meaning by default', () => {
        const kanji = testCases[0];
        render(<KanjiTile kanji={kanji} />);
        expect(screen.getByText(kanji.character)).toBeInTheDocument();
        expect(screen.queryByText(kanji.kunyomi.join(', '))).not.toBeInTheDocument();
        expect(screen.queryByText(kanji.meaning.join(', '))).not.toBeInTheDocument();
    });

    it('shows reading but hides meaning when only showReading is true', () => {
        const kanji = testCases[0];
        render(<KanjiTile kanji={kanji} showReading={true} showMeaning={false} />);
        expect(screen.getByText(kanji.kunyomi.join(', '))).toBeInTheDocument();
        expect(screen.queryByText(kanji.meaning.join(', '))).not.toBeInTheDocument();
    });

    it('shows meaning but hides reading when only showMeaning is true', () => {
        const kanji = testCases[0];
        render(<KanjiTile kanji={kanji} showReading={false} showMeaning={true} />);
        expect(screen.getByText(kanji.meaning.join(', '))).toBeInTheDocument();
        expect(screen.queryByText(kanji.kunyomi.join(', '))).not.toBeInTheDocument();
    });

    it('renders with "correct" status', () => {
        const { getByTestId } = render(<KanjiTile kanji={testCases[0]} status="correct" />);
        expect(getByTestId('kanji-tile')).toBeInTheDocument();
    });

    it('renders with "incorrect" status', () => {
        const { getByTestId } = render(<KanjiTile kanji={testCases[0]} status="incorrect" />);
        expect(getByTestId('kanji-tile')).toBeInTheDocument();
    });
});
