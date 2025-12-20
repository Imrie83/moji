export type KanjiLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export interface Kanji {
    character: string;
    onyomi: string[];
    kunyomi: string[];
    meaning: string[];
    level: KanjiLevel;
}
