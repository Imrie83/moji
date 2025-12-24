import type { Kana } from '../interfaces/kana';

export const katakana: Kana[] = [
    // Gojūon - Basic 46 characters
    // Vowels
    { character: 'ア', romaji: 'a', type: 'katakana' },
    { character: 'イ', romaji: 'i', type: 'katakana' },
    { character: 'ウ', romaji: 'u', type: 'katakana' },
    { character: 'エ', romaji: 'e', type: 'katakana' },
    { character: 'オ', romaji: 'o', type: 'katakana' },

    // K-line
    { character: 'カ', romaji: 'ka', type: 'katakana' },
    { character: 'キ', romaji: 'ki', type: 'katakana' },
    { character: 'ク', romaji: 'ku', type: 'katakana' },
    { character: 'ケ', romaji: 'ke', type: 'katakana' },
    { character: 'コ', romaji: 'ko', type: 'katakana' },

    // S-line
    { character: 'サ', romaji: 'sa', type: 'katakana' },
    { character: 'シ', romaji: 'shi', type: 'katakana' },
    { character: 'ス', romaji: 'su', type: 'katakana' },
    { character: 'セ', romaji: 'se', type: 'katakana' },
    { character: 'ソ', romaji: 'so', type: 'katakana' },

    // T-line
    { character: 'タ', romaji: 'ta', type: 'katakana' },
    { character: 'チ', romaji: 'chi', type: 'katakana' },
    { character: 'ツ', romaji: 'tsu', type: 'katakana' },
    { character: 'テ', romaji: 'te', type: 'katakana' },
    { character: 'ト', romaji: 'to', type: 'katakana' },

    // N-line
    { character: 'ナ', romaji: 'na', type: 'katakana' },
    { character: 'ニ', romaji: 'ni', type: 'katakana' },
    { character: 'ヌ', romaji: 'nu', type: 'katakana' },
    { character: 'ネ', romaji: 'ne', type: 'katakana' },
    { character: 'ノ', romaji: 'no', type: 'katakana' },

    // H-line
    { character: 'ハ', romaji: 'ha', type: 'katakana' },
    { character: 'ヒ', romaji: 'hi', type: 'katakana' },
    { character: 'フ', romaji: 'fu', type: 'katakana' },
    { character: 'ヘ', romaji: 'he', type: 'katakana' },
    { character: 'ホ', romaji: 'ho', type: 'katakana' },

    // M-line
    { character: 'マ', romaji: 'ma', type: 'katakana' },
    { character: 'ミ', romaji: 'mi', type: 'katakana' },
    { character: 'ム', romaji: 'mu', type: 'katakana' },
    { character: 'メ', romaji: 'me', type: 'katakana' },
    { character: 'モ', romaji: 'mo', type: 'katakana' },

    // Y-line
    { character: 'ヤ', romaji: 'ya', type: 'katakana' },
    { character: 'ユ', romaji: 'yu', type: 'katakana' },
    { character: 'ヨ', romaji: 'yo', type: 'katakana' },

    // R-line
    { character: 'ラ', romaji: 'ra', type: 'katakana' },
    { character: 'リ', romaji: 'ri', type: 'katakana' },
    { character: 'ル', romaji: 'ru', type: 'katakana' },
    { character: 'レ', romaji: 're', type: 'katakana' },
    { character: 'ロ', romaji: 'ro', type: 'katakana' },

    // W-line and N
    { character: 'ワ', romaji: 'wa', type: 'katakana' },
    { character: 'ヲ', romaji: 'wo', type: 'katakana' },
    { character: 'ン', romaji: 'n', type: 'katakana' },

    // Dakuon - Voiced consonants
    // G-line
    { character: 'ガ', romaji: 'ga', type: 'katakana' },
    { character: 'ギ', romaji: 'gi', type: 'katakana' },
    { character: 'グ', romaji: 'gu', type: 'katakana' },
    { character: 'ゲ', romaji: 'ge', type: 'katakana' },
    { character: 'ゴ', romaji: 'go', type: 'katakana' },

    // Z-line
    { character: 'ザ', romaji: 'za', type: 'katakana' },
    { character: 'ジ', romaji: 'ji', type: 'katakana' },
    { character: 'ズ', romaji: 'zu', type: 'katakana' },
    { character: 'ゼ', romaji: 'ze', type: 'katakana' },
    { character: 'ゾ', romaji: 'zo', type: 'katakana' },

    // D-line
    { character: 'ダ', romaji: 'da', type: 'katakana' },
    { character: 'ヂ', romaji: 'ji', type: 'katakana' },
    { character: 'ヅ', romaji: 'zu', type: 'katakana' },
    { character: 'デ', romaji: 'de', type: 'katakana' },
    { character: 'ド', romaji: 'do', type: 'katakana' },

    // B-line
    { character: 'バ', romaji: 'ba', type: 'katakana' },
    { character: 'ビ', romaji: 'bi', type: 'katakana' },
    { character: 'ブ', romaji: 'bu', type: 'katakana' },
    { character: 'ベ', romaji: 'be', type: 'katakana' },
    { character: 'ボ', romaji: 'bo', type: 'katakana' },

    // Handakuon - Semi-voiced consonants (P-line)
    { character: 'パ', romaji: 'pa', type: 'katakana' },
    { character: 'ピ', romaji: 'pi', type: 'katakana' },
    { character: 'プ', romaji: 'pu', type: 'katakana' },
    { character: 'ペ', romaji: 'pe', type: 'katakana' },
    { character: 'ポ', romaji: 'po', type: 'katakana' },

    // Yōon - Contracted sounds
    { character: 'キャ', romaji: 'kya', type: 'katakana' },
    { character: 'キュ', romaji: 'kyu', type: 'katakana' },
    { character: 'キョ', romaji: 'kyo', type: 'katakana' },

    { character: 'シャ', romaji: 'sha', type: 'katakana' },
    { character: 'シュ', romaji: 'shu', type: 'katakana' },
    { character: 'ショ', romaji: 'sho', type: 'katakana' },

    { character: 'チャ', romaji: 'cha', type: 'katakana' },
    { character: 'チュ', romaji: 'chu', type: 'katakana' },
    { character: 'チョ', romaji: 'cho', type: 'katakana' },

    { character: 'ニャ', romaji: 'nya', type: 'katakana' },
    { character: 'ニュ', romaji: 'nyu', type: 'katakana' },
    { character: 'ニョ', romaji: 'nyo', type: 'katakana' },

    { character: 'ヒャ', romaji: 'hya', type: 'katakana' },
    { character: 'ヒュ', romaji: 'hyu', type: 'katakana' },
    { character: 'ヒョ', romaji: 'hyo', type: 'katakana' },

    { character: 'ミャ', romaji: 'mya', type: 'katakana' },
    { character: 'ミュ', romaji: 'myu', type: 'katakana' },
    { character: 'ミョ', romaji: 'myo', type: 'katakana' },

    { character: 'リャ', romaji: 'rya', type: 'katakana' },
    { character: 'リュ', romaji: 'ryu', type: 'katakana' },
    { character: 'リョ', romaji: 'ryo', type: 'katakana' },

    // Yōon with dakuon
    { character: 'ギャ', romaji: 'gya', type: 'katakana' },
    { character: 'ギュ', romaji: 'gyu', type: 'katakana' },
    { character: 'ギョ', romaji: 'gyo', type: 'katakana' },

    { character: 'ジャ', romaji: 'ja', type: 'katakana' },
    { character: 'ジュ', romaji: 'ju', type: 'katakana' },
    { character: 'ジョ', romaji: 'jo', type: 'katakana' },

    { character: 'ビャ', romaji: 'bya', type: 'katakana' },
    { character: 'ビュ', romaji: 'byu', type: 'katakana' },
    { character: 'ビョ', romaji: 'byo', type: 'katakana' },

    // Yōon with handakuon
    { character: 'ピャ', romaji: 'pya', type: 'katakana' },
    { character: 'ピュ', romaji: 'pyu', type: 'katakana' },
    { character: 'ピョ', romaji: 'pyo', type: 'katakana' },
];
