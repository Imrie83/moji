import { render, screen } from '@testing-library/react';
import { KanjiDetailTile } from './KanjiDetailTile';
import type { Kanji } from '../../interfaces/kanji';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';

describe('KanjiDetailTile', () => {
    const mockKanji: Kanji = {
        character: '日',
        onyomi: ['ニチ', 'ジツ'],
        kunyomi: ['ひ', 'か'],
        meaning: ['day', 'sun', 'Japan'],
        level: 'N5'
    };

    it('renders the kanji character', () => {
        render(<KanjiDetailTile kanji={mockKanji} />);
        expect(screen.getByText('日')).toBeInTheDocument();
    });

    it('renders all meanings', () => {
        render(<KanjiDetailTile kanji={mockKanji} />);
        // Meanings are joined by comma
        expect(screen.getByText('day, sun, Japan')).toBeInTheDocument();
    });

    it('renders onyomi readings', () => {
        render(<KanjiDetailTile kanji={mockKanji} />);
        expect(screen.getByText('ニチ')).toBeInTheDocument();
        expect(screen.getByText('ジツ')).toBeInTheDocument();
    });

    it('renders kunyomi readings', () => {
        render(<KanjiDetailTile kanji={mockKanji} />);
        expect(screen.getByText('ひ')).toBeInTheDocument();
        expect(screen.getByText('か')).toBeInTheDocument();
    });

    it('renders empty readings state', () => {
        const emptyKanji: Kanji = {
            ...mockKanji,
            onyomi: [],
            kunyomi: []
        };
        render(<KanjiDetailTile kanji={emptyKanji} />);
        const dashes = screen.getAllByText('—');
        expect(dashes).toHaveLength(2); // One for onyomi, one for kunyomi
    });
});
