import type { Messages } from './types';

// Leaderboard page and model page. One entry per key, English and French side by side.
export const leaderboardMessages = {
    'leaderboard.release': {
        en: 'Release {release} · scored on the test set',
        fr: 'Version {release} · notée sur la partie de test',
    },

    'leaderboard.releaseShort': {
        en: 'Release {release} · test set',
        fr: 'Version {release} · partie de test',
    },

    'leaderboard.sampleData': {
        en: 'Sample data',
        fr: "Données d'exemple",
    },

    'leaderboard.sortBy': {
        en: 'Sort: {metric}',
        fr: 'Tri : {metric}',
    },

    'leaderboard.fullRanking': {
        en: 'Full ranking',
        fr: 'Classement complet',
    },

    'leaderboard.empty': {
        en: 'No approved submissions on this track yet.',
        fr: 'Aucune soumission approuvée sur cette piste pour le moment.',
    },

    'leaderboard.nowPlaying': {
        en: 'Now playing',
        fr: 'En lecture',
    },

    'leaderboard.pressPlay': {
        en: 'Press play on a model to hear its restoration',
        fr: 'Lancez un modèle pour écouter sa restauration',
    },

    'leaderboard.playModel': {
        en: 'Play the restoration by {model}',
        fr: 'Écouter la restauration de {model}',
    },

    'leaderboard.pauseModel': {
        en: 'Pause the restoration by {model}',
        fr: 'Mettre en pause la restauration de {model}',
    },

    'leaderboard.listeningShort': {
        en: '{value} listening',
        fr: '{value} écoute',
    },

    'leaderboard.openModel': {
        en: 'Open {model}: hear its test samples',
        fr: 'Ouvrir {model} : écouter ses extraits de test',
    },

    'leaderboard.listeningWord': {
        en: 'listening',
        fr: 'écoute',
    },

    'leaderboard.rank': {
        en: 'Rank {rank}',
        fr: 'Rang {rank}',
    },

    'leaderboard.model.eyebrow': {
        en: 'Model · rank {rank} on {track}',
        fr: 'Modèle · rang {rank} sur {track}',
    },
    'leaderboard.model.attribution': {
        en: '{lab} · approved {date}',
        fr: '{lab} · approuvé le {date}',
    },
    'leaderboard.model.trainedOn': {
        en: 'Trained on {data}',
        fr: 'Entraîné sur {data}',
    },
    'leaderboard.model.notFound': {
        en: 'This model is not on the leaderboard for this track.',
        fr: "Ce modèle n'est pas dans le classement de cette piste.",
    },
    'leaderboard.model.links.code': {
        en: 'Code repo',
        fr: 'Code',
    },
    'leaderboard.model.links.weights': {
        en: 'Model weights',
        fr: 'Poids du modèle',
    },
    'leaderboard.model.links.paper': {
        en: 'Paper',
        fr: 'Article',
    },

    'leaderboard.metricsTable.title': {
        en: 'Metrics',
        fr: 'Métriques',
    },
    'leaderboard.metricsTable.subtitle': {
        en: 'Test split · {clips} clips · release {version}. Each metric compares the audio to the original. Diagnostic only: no single metric gives the rank.',
        fr: "Partie de test · {clips} extraits · version {version}. Chaque métrique compare l'audio à l'original. Diagnostic uniquement : aucune métrique seule ne donne le rang.",
    },
    'leaderboard.metricsTable.category': {
        en: 'Category: {category}',
        fr: 'Catégorie : {category}',
    },
    'leaderboard.metricsTable.allCategories': {
        en: 'All categories',
        fr: 'Toutes les catégories',
    },
    'leaderboard.metricsTable.tileDetail': {
        en: '{metric} improvement · restored {value}',
        fr: 'Amélioration {metric} · restauré {value}',
    },
    'leaderboard.metricsTable.columns.metric': {
        en: 'Metric',
        fr: 'Métrique',
    },
    'leaderboard.metricsTable.columns.degraded': {
        en: 'Degraded input',
        fr: 'Entrée dégradée',
    },
    'leaderboard.metricsTable.columns.restored': {
        en: 'Restored',
        fr: 'Restauré',
    },
    'leaderboard.metricsTable.columns.improvement': {
        en: 'Improvement',
        fr: 'Amélioration',
    },
    'leaderboard.metricsTable.direction.higher': {
        en: 'Higher is better',
        fr: 'Plus haut est meilleur',
    },
    'leaderboard.metricsTable.direction.lower': {
        en: 'Lower is better',
        fr: 'Plus bas est meilleur',
    },
    'leaderboard.metricsTable.groups.waveform.title': {
        en: 'Waveform',
        fr: "Forme d'onde",
    },
    'leaderboard.metricsTable.groups.waveform.description': {
        en: 'Sample-level error',
        fr: "Erreur au niveau de l'échantillon",
    },
    'leaderboard.metricsTable.groups.spectral.title': {
        en: 'Spectral',
        fr: 'Spectre',
    },
    'leaderboard.metricsTable.groups.spectral.description': {
        en: 'Differences in the spectrum',
        fr: 'Différences dans le spectre',
    },
    'leaderboard.metricsTable.groups.reverb.title': {
        en: 'Reverb',
        fr: 'Réverbération',
    },
    'leaderboard.metricsTable.groups.reverb.description': {
        en: 'Residual room response, most useful for reverb',
        fr: 'Réponse de salle résiduelle, surtout utile pour la réverbération',
    },
    'leaderboard.metricsTable.groups.degradationAware.title': {
        en: 'Degradation',
        fr: 'Dégradation',
    },
    'leaderboard.metricsTable.groups.degradationAware.description': {
        en: 'Degradation-aware error, measured on what the degradation affects',
        fr: 'Erreur selon la dégradation, mesurée sur ce qu’elle modifie',
    },
    'leaderboard.metricsTable.groups.perceptual.title': {
        en: 'Perceptual',
        fr: 'Perceptuelles',
    },
    'leaderboard.metricsTable.groups.perceptual.description': {
        en: 'Learned embeddings and aesthetics (GPU metric pack)',
        fr: 'Embeddings appris et esthétique (pack de métriques GPU)',
    },
    'leaderboard.metricsTable.metrics.snr_db': {
        en: 'SNR',
        fr: 'SNR',
    },
    'leaderboard.metricsTable.metrics.si_sdr_db': {
        en: 'SI-SDR',
        fr: 'SI-SDR',
    },
    'leaderboard.metricsTable.metrics.si_snr_db': {
        en: 'SI-SNR',
        fr: 'SI-SNR',
    },
    'leaderboard.metricsTable.metrics.l1': {
        en: 'L1 error',
        fr: 'Erreur L1',
    },
    'leaderboard.metricsTable.metrics.rmse': {
        en: 'RMSE',
        fr: 'RMSE',
    },
    'leaderboard.metricsTable.metrics.lsd_db': {
        en: 'Log-spectral distance',
        fr: 'Distance log-spectrale',
    },
    'leaderboard.metricsTable.metrics.mrstft': {
        en: 'Multi-resolution STFT',
        fr: 'STFT multirésolution',
    },
    'leaderboard.metricsTable.metrics.log_mel': {
        en: 'Log-mel distance',
        fr: 'Distance log-mel',
    },
    'leaderboard.metricsTable.metrics.ltas': {
        en: 'Long-term spectrum (LTAS)',
        fr: 'Spectre à long terme (LTAS)',
    },
    'leaderboard.metricsTable.metrics.log_mel_ssim': {
        en: 'Log-mel SSIM',
        fr: 'SSIM log-mel',
    },
    'leaderboard.metricsTable.metrics.spectral_kl': {
        en: 'Spectral KL divergence',
        fr: 'Divergence KL spectrale',
    },
    'leaderboard.metricsTable.metrics.rt60_s': {
        en: 'RT60',
        fr: 'RT60',
    },
    'leaderboard.metricsTable.metrics.drr_db': {
        en: 'Direct-to-reverberant ratio',
        fr: 'Rapport direct/réverbéré',
    },
    'leaderboard.metricsTable.metrics.late_tail_db': {
        en: 'Late reverb tail',
        fr: 'Queue de réverbération',
    },
    'leaderboard.metricsTable.metrics.aae': {
        en: 'AAE',
        fr: 'AAE',
    },
    'leaderboard.metricsTable.metrics.clap_cosine': {
        en: 'CLAP similarity',
        fr: 'Similarité CLAP',
    },
    'leaderboard.metricsTable.metrics.fadtk_clean': {
        en: 'FAD vs. original',
        fr: 'FAD vs. original',
    },
    'leaderboard.metricsTable.metrics.fadtk_fma_pop': {
        en: 'FAD vs. FMA pop',
        fr: 'FAD vs. FMA pop',
    },
    'leaderboard.metricsTable.metrics.audiobox_ce': {
        en: 'Audiobox content enjoyment',
        fr: 'Audiobox plaisir du contenu',
    },
    'leaderboard.metricsTable.metrics.audiobox_cu': {
        en: 'Audiobox content usefulness',
        fr: 'Audiobox utilité du contenu',
    },
    'leaderboard.metricsTable.metrics.audiobox_pc': {
        en: 'Audiobox production complexity',
        fr: 'Audiobox complexité de production',
    },
    'leaderboard.metricsTable.metrics.audiobox_pq': {
        en: 'Audiobox production quality',
        fr: 'Audiobox qualité de production',
    },

    'leaderboard.samples.title': {
        en: 'Test samples',
        fr: 'Extraits de test',
    },
    'leaderboard.samples.subtitle': {
        en: '{n} public test clips restored by this model. Click one to play it, or its degradation to see the metrics for that category.',
        fr: '{n} extraits de test publics restaurés par ce modèle. Cliquez sur un extrait pour l’écouter, ou sur sa dégradation pour voir les métriques de cette catégorie.',
    },
    'leaderboard.samples.showCategory': {
        en: 'Show the metrics for {category}',
        fr: 'Voir les métriques pour {category}',
    },
    'leaderboard.samples.play': {
        en: 'Play {sample}',
        fr: 'Écouter {sample}',
    },
    'leaderboard.samples.pause': {
        en: 'Pause {sample}',
        fr: 'Mettre en pause {sample}',
    },
    'leaderboard.samples.severity': {
        en: 'Severity {severity}',
        fr: 'Sévérité {severity}',
    },
    'leaderboard.samples.columns.sample': {
        en: 'Test sample',
        fr: 'Extrait de test',
    },
    'leaderboard.samples.columns.degradation': {
        en: 'Degradation',
        fr: 'Dégradation',
    },
    'leaderboard.samples.columns.length': {
        en: 'Length',
        fr: 'Durée',
    },

    'leaderboard.compare.title': {
        en: 'Compare',
        fr: 'Comparer',
    },
    'leaderboard.compare.description': {
        en: '{sample} · {degradation}, {severity}. Same position on every source.',
        fr: '{sample} · {degradation}, {severity}. Même position sur chaque source.',
    },
    'leaderboard.compare.others': {
        en: 'Other models on this sample',
        fr: 'Autres modèles sur cet extrait',
    },
    'leaderboard.compare.mobileTitle': {
        en: 'Compare · {sample}',
        fr: 'Comparer · {sample}',
    },
    'leaderboard.compare.mobileHint': {
        en: 'Tap a source. Playback keeps its position.',
        fr: 'Touchez une source. La lecture garde sa position.',
    },

    'leaderboard.places.1': {
        en: 'Top performer',
        fr: 'Meilleur résultat',
    },
    'leaderboard.places.2': {
        en: 'Second',
        fr: 'Deuxième',
    },
    'leaderboard.places.3': {
        en: 'Third',
        fr: 'Troisième',
    },

    'leaderboard.metrics.snrGain': {
        en: 'SNR gain',
        fr: 'Gain SNR',
    },
    'leaderboard.metrics.listening': {
        en: 'Listening',
        fr: 'Écoute',
    },

    'leaderboard.columns.model': {
        en: 'Model',
        fr: 'Modèle',
    },
    'leaderboard.columns.snrGain': {
        en: 'SNR gain',
        fr: 'Gain SNR',
    },
    'leaderboard.columns.listening': {
        en: 'Listening',
        fr: 'Écoute',
    },

    'leaderboard.scores.title': {
        en: 'How scores work',
        fr: 'Comment les scores sont calculés',
    },
    'leaderboard.scores.snrGain.term': {
        en: 'SNR gain',
        fr: 'Gain SNR',
    },
    'leaderboard.scores.snrGain.definition': {
        en: 'Signal-to-noise ratio of the restored audio minus that of the degraded input, in dB.',
        fr: "Rapport signal sur bruit de l'audio restauré moins celui de l'entrée dégradée, en dB.",
    },
    'leaderboard.scores.listening.term': {
        en: 'Listening test',
        fr: "Test d'écoute",
    },
    'leaderboard.scores.listening.definition': {
        en: 'Mean rating from structured listening tests. [Scale: VITA to confirm]',
        fr: "Note moyenne des tests d'écoute structurés. [Échelle : à confirmer par VITA]",
    },
    'leaderboard.scores.note': {
        en: 'Only approved submissions are ranked. [Tie-break rule: open question]',
        fr: 'Seules les soumissions approuvées sont classées. [Règle de départage : question ouverte]',
    },
} satisfies Messages;
