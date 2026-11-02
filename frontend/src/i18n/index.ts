// Texts, one file per page in this folder: each entry is a flat, dotted key (the path passed
// to t(), e.g. t('leaderboard.metricsTable.title')) with its English and French versions side
// by side. Placeholders ({n}) and plural forms ('one | many') follow vue-i18n's syntax.
// Adding a text: add one entry, in both languages, to the file of the page that shows it
// (common.ts when several pages share it).
import { commonMessages } from './common';
import { datasetsMessages } from './datasets';
import { leaderboardMessages } from './leaderboard';
import { submissionMessages } from './submission';

const messages = {
    ...commonMessages,
    ...datasetsMessages,
    ...leaderboardMessages,
    ...submissionMessages,
};

export type MessageKey = keyof typeof messages;

// vue-i18n wants one message object per locale: pick each language out of the flat list.
// The keys stay flat; the boot file enables vue-i18n's flatJson to read them.
function forLanguage(language: 'en' | 'fr'): Record<MessageKey, string> {
    return Object.fromEntries(
        Object.entries(messages).map(([key, text]) => [key, text[language]]),
    ) as Record<MessageKey, string>;
}

export default {
    'en-US': forLanguage('en'),
    fr: forLanguage('fr'),
};
