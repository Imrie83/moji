import type { Kana } from '../interfaces/kana';

export const hiragana: Kana[] = [
    // Gojūon - Basic 46 characters
    // Vowels
    { character: 'あ', romaji: 'a', type: 'hiragana' },
    { character: 'い', romaji: 'i', type: 'hiragana' },
    { character: 'う', romaji: 'u', type: 'hiragana' },
    { character: 'え', romaji: 'e', type: 'hiragana' },
    { character: 'お', romaji: 'o', type: 'hiragana' },

    // K-line
    { character: 'か', romaji: 'ka', type: 'hiragana' },
    { character: 'き', romaji: 'ki', type: 'hiragana' },
    { character: 'く', romaji: 'ku', type: 'hiragana' },
    { character: 'け', romaji: 'ke', type: 'hiragana' },
    { character: 'こ', romaji: 'ko', type: 'hiragana' },

    // S-line
    { character: 'さ', romaji: 'sa', type: 'hiragana' },
    { character: 'し', romaji: 'shi', type: 'hiragana' },
    { character: 'す', romaji: 'su', type: 'hiragana' },
    { character: 'せ', romaji: 'se', type: 'hiragana' },
    { character: 'そ', romaji: 'so', type: 'hiragana' },

    // T-line
    { character: 'た', romaji: 'ta', type: 'hiragana' },
    { character: 'ち', romaji: 'chi', type: 'hiragana' },
    { character: 'つ', romaji: 'tsu', type: 'hiragana' },
    { character: 'て', romaji: 'te', type: 'hiragana' },
    { character: 'と', romaji: 'to', type: 'hiragana' },

    // N-line
    { character: 'な', romaji: 'na', type: 'hiragana' },
    { character: 'に', romaji: 'ni', type: 'hiragana' },
    { character: 'ぬ', romaji: 'nu', type: 'hiragana' },
    { character: 'ね', romaji: 'ne', type: 'hiragana' },
    { character: 'の', romaji: 'no', type: 'hiragana' },

    // H-line
    { character: 'は', romaji: 'ha', type: 'hiragana' },
    { character: 'ひ', romaji: 'hi', type: 'hiragana' },
    { character: 'ふ', romaji: 'fu', type: 'hiragana' },
    { character: 'へ', romaji: 'he', type: 'hiragana' },
    { character: 'ほ', romaji: 'ho', type: 'hiragana' },

    // M-line
    { character: 'ま', romaji: 'ma', type: 'hiragana' },
    { character: 'み', romaji: 'mi', type: 'hiragana' },
    { character: 'む', romaji: 'mu', type: 'hiragana' },
    { character: 'め', romaji: 'me', type: 'hiragana' },
    { character: 'も', romaji: 'mo', type: 'hiragana' },

    // Y-line
    { character: 'や', romaji: 'ya', type: 'hiragana' },
    { character: 'ゆ', romaji: 'yu', type: 'hiragana' },
    { character: 'よ', romaji: 'yo', type: 'hiragana' },

    // R-line
    { character: 'ら', romaji: 'ra', type: 'hiragana' },
    { character: 'り', romaji: 'ri', type: 'hiragana' },
    { character: 'る', romaji: 'ru', type: 'hiragana' },
    { character: 'れ', romaji: 're', type: 'hiragana' },
    { character: 'ろ', romaji: 'ro', type: 'hiragana' },

    // W-line and N
    { character: 'わ', romaji: 'wa', type: 'hiragana' },
    { character: 'を', romaji: 'wo', type: 'hiragana' },
    { character: 'ん', romaji: 'n', type: 'hiragana' },

    // Dakuon - Voiced consonants
    // G-line
    { character: 'が', romaji: 'ga', type: 'hiragana' },
    { character: 'ぎ', romaji: 'gi', type: 'hiragana' },
    { character: 'ぐ', romaji: 'gu', type: 'hiragana' },
    { character: 'げ', romaji: 'ge', type: 'hiragana' },
    { character: 'ご', romaji: 'go', type: 'hiragana' },

    // Z-line
    { character: 'ざ', romaji: 'za', type: 'hiragana' },
    { character: 'じ', romaji: 'ji', type: 'hiragana' },
    { character: 'ず', romaji: 'zu', type: 'hiragana' },
    { character: 'ぜ', romaji: 'ze', type: 'hiragana' },
    { character: 'ぞ', romaji: 'zo', type: 'hiragana' },

    // D-line
    { character: 'だ', romaji: 'da', type: 'hiragana' },
    { character: 'ぢ', romaji: 'ji', type: 'hiragana' },
    { character: 'づ', romaji: 'zu', type: 'hiragana' },
    { character: 'で', romaji: 'de', type: 'hiragana' },
    { character: 'ど', romaji: 'do', type: 'hiragana' },

    // B-line
    { character: 'ば', romaji: 'ba', type: 'hiragana' },
    { character: 'び', romaji: 'bi', type: 'hiragana' },
    { character: 'ぶ', romaji: 'bu', type: 'hiragana' },
    { character: 'べ', romaji: 'be', type: 'hiragana' },
    { character: 'ぼ', romaji: 'bo', type: 'hiragana' },

    // Handakuon - Semi-voiced consonants (P-line)
    { character: 'ぱ', romaji: 'pa', type: 'hiragana' },
    { character: 'ぴ', romaji: 'pi', type: 'hiragana' },
    { character: 'ぷ', romaji: 'pu', type: 'hiragana' },
    { character: 'ぺ', romaji: 'pe', type: 'hiragana' },
    { character: 'ぽ', romaji: 'po', type: 'hiragana' },

    // Yōon - Contracted sounds
    { character: 'きゃ', romaji: 'kya', type: 'hiragana' },
    { character: 'きゅ', romaji: 'kyu', type: 'hiragana' },
    { character: 'きょ', romaji: 'kyo', type: 'hiragana' },

    { character: 'しゃ', romaji: 'sha', type: 'hiragana' },
    { character: 'しゅ', romaji: 'shu', type: 'hiragana' },
    { character: 'しょ', romaji: 'sho', type: 'hiragana' },

    { character: 'ちゃ', romaji: 'cha', type: 'hiragana' },
    { character: 'ちゅ', romaji: 'chu', type: 'hiragana' },
    { character: 'ちょ', romaji: 'cho', type: 'hiragana' },

    { character: 'にゃ', romaji: 'nya', type: 'hiragana' },
    { character: 'にゅ', romaji: 'nyu', type: 'hiragana' },
    { character: 'にょ', romaji: 'nyo', type: 'hiragana' },

    { character: 'ひゃ', romaji: 'hya', type: 'hiragana' },
    { character: 'ひゅ', romaji: 'hyu', type: 'hiragana' },
    { character: 'ひょ', romaji: 'hyo', type: 'hiragana' },

    { character: 'みゃ', romaji: 'mya', type: 'hiragana' },
    { character: 'みゅ', romaji: 'myu', type: 'hiragana' },
    { character: 'みょ', romaji: 'myo', type: 'hiragana' },

    { character: 'りゃ', romaji: 'rya', type: 'hiragana' },
    { character: 'りゅ', romaji: 'ryu', type: 'hiragana' },
    { character: 'りょ', romaji: 'ryo', type: 'hiragana' },

    // Yōon with dakuon
    { character: 'ぎゃ', romaji: 'gya', type: 'hiragana' },
    { character: 'ぎゅ', romaji: 'gyu', type: 'hiragana' },
    { character: 'ぎょ', romaji: 'gyo', type: 'hiragana' },

    { character: 'じゃ', romaji: 'ja', type: 'hiragana' },
    { character: 'じゅ', romaji: 'ju', type: 'hiragana' },
    { character: 'じょ', romaji: 'jo', type: 'hiragana' },

    { character: 'びゃ', romaji: 'bya', type: 'hiragana' },
    { character: 'びゅ', romaji: 'byu', type: 'hiragana' },
    { character: 'びょ', romaji: 'byo', type: 'hiragana' },

    // Yōon with handakuon
    { character: 'ぴゃ', romaji: 'pya', type: 'hiragana' },
    { character: 'ぴゅ', romaji: 'pyu', type: 'hiragana' },
    { character: 'ぴょ', romaji: 'pyo', type: 'hiragana' },
];
