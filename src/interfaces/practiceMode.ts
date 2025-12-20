export const PracticeMode = {
    None: 'none',
    KanjiPractice: 'kanjiPractice',
} as const;

export type PracticeMode = typeof PracticeMode[keyof typeof PracticeMode];
