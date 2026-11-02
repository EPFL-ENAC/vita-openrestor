import type { Messages } from './types';

// Datasets page. One entry per key, English and French side by side.
export const datasetsMessages = {
    'datasets.kind': {
        en: 'Datasets',
        fr: 'Jeux de données',
    },

    'datasets.subtitle': {
        en: 'public splits for training and testing',
        fr: "parties publiques pour l'entraînement et le test",
    },

    'datasets.metadata': {
        en: '{version} · {tracks} tracks · {standards} metadata · licence {licence}',
        fr: '{version} · {tracks} pistes · métadonnées {standards} · licence {licence}',
    },

    'datasets.metadataShort': {
        en: '{version} · licence {licence}',
        fr: '{version} · licence {licence}',
    },

    'datasets.trackIntro': {
        en: '{track} · {description} Both splits are public. Scores come from running your model on the test split.',
        fr: "{track} · {description} Les deux parties sont publiques. Les scores viennent de l'exécution de votre modèle sur la partie de test.",
    },

    'datasets.trackDetails': {
        en: 'Track details',
        fr: 'Détails de la piste',
    },

    'datasets.recipes': {
        en: 'Degradation recipes .json',
        fr: 'Recettes de dégradation .json',
    },

    'datasets.clips': {
        en: '{n} clips',
        fr: '{n} extraits',
    },

    'datasets.notDownloadable': {
        en: 'Not downloadable',
        fr: 'Non téléchargeable',
    },

    'datasets.downloadPart': {
        en: 'Download {part} audio of the {split} split',
        fr: "Télécharger l'audio {part} de la partie {split}",
    },

    'datasets.splits.train.name': {
        en: 'Train',
        fr: 'Entraînement',
    },
    'datasets.splits.train.detail': {
        en: 'For training and tuning your model',
        fr: 'Pour entraîner et régler votre modèle',
    },
    'datasets.splits.test.name': {
        en: 'Test',
        fr: 'Test',
    },
    'datasets.splits.test.detail': {
        en: 'Used for scoring and played on the leaderboard',
        fr: 'Sert au calcul des scores et écoutée dans le classement',
    },

    'datasets.contents.pairs': {
        en: 'Original + degraded pairs',
        fr: 'Paires original + dégradé',
    },

    'datasets.parts.original': {
        en: 'Original',
        fr: 'Original',
    },
    'datasets.parts.degraded': {
        en: 'Degraded',
        fr: 'Dégradé',
    },

    'datasets.samples.title': {
        en: 'Sample clips',
        fr: 'Extraits d’exemple',
    },
    'datasets.samples.play': {
        en: 'Play {sample}',
        fr: 'Écouter {sample}',
    },
    'datasets.samples.pause': {
        en: 'Pause {sample}',
        fr: 'Mettre en pause {sample}',
    },

    'datasets.fields.trainClips': {
        en: 'Train clips',
        fr: "Extraits d'entraînement",
    },
    'datasets.fields.testClips': {
        en: 'Test clips',
        fr: 'Extraits de test',
    },
    'datasets.fields.versionsPerClip': {
        en: 'Per clip',
        fr: 'Par extrait',
    },
    'datasets.fields.degradations': {
        en: 'Degradations',
        fr: 'Dégradations',
    },
    'datasets.fields.undocumented': {
        en: 'Real, undocumented',
        fr: 'Réelles, non documentées',
    },
    'datasets.fields.clipLength': {
        en: 'Clip length',
        fr: 'Durée',
    },
    'datasets.fields.seconds': {
        en: '{seconds} s',
        fr: '{seconds} s',
    },
    'datasets.fields.audioFormat': {
        en: 'Audio format',
        fr: 'Format audio',
    },
    'datasets.fields.metadata': {
        en: 'Metadata',
        fr: 'Métadonnées',
    },
    'datasets.fields.licence': {
        en: 'Licence',
        fr: 'Licence',
    },
    'datasets.fields.version': {
        en: 'Version',
        fr: 'Version',
    },
} satisfies Messages;
