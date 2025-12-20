import type { Kanji } from '../interfaces/kanji';
import { kanji_n5 } from './kanji_n5';
import { kanji_n4 } from './kanji_n4';
import { kanji_n3 } from './kanji_n3';

export const kanjiList: Kanji[] = [
    ...kanji_n5,
    ...kanji_n4,
    ...kanji_n3
];
