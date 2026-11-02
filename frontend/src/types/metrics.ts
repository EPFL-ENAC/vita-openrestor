// Metrics from the OpenRestor scoring pipeline (vita-epfl/OpenRestor, openrestor/metrics).
// Every metric compares an audio file to the original: once for the degraded input and once
// for the model's restoration. "improvement" is oriented so that a positive value always
// means the restoration is closer to the original than the degraded input was.
// The pipeline report is diagnostic only: it defines no aggregate or rank.

// Metric groups, in display order. Keys are the pipeline's own metric names.
export const METRIC_GROUPS = [
    // Objective metrics on the waveform (core.py, pairwise_metrics)
    { key: 'waveform', metrics: ['snr_db', 'si_sdr_db', 'si_snr_db', 'l1', 'rmse'] },
    // Objective metrics on the spectrum (core.py, pairwise_metrics)
    {
        key: 'spectral',
        metrics: ['lsd_db', 'mrstft', 'log_mel', 'ltas', 'log_mel_ssim', 'spectral_kl'],
    },
    // Residual room response; most meaningful for reverb degradations (core.py)
    { key: 'reverb', metrics: ['rt60_s', 'drr_db', 'late_tail_db'] },
    // Degradation-aware error, measured on the features the degradation category affects
    { key: 'degradationAware', metrics: ['aae'] },
    // Optional GPU metric pack: learned embeddings and aesthetics (perceptual.py)
    {
        key: 'perceptual',
        metrics: [
            'clap_cosine',
            'fadtk_clean',
            'fadtk_fma_pop',
            'audiobox_ce',
            'audiobox_cu',
            'audiobox_pc',
            'audiobox_pq',
        ],
    },
] as const;

export type MetricGroupKey = (typeof METRIC_GROUPS)[number]['key'];
export type MetricKey = (typeof METRIC_GROUPS)[number]['metrics'][number];

export interface MetricValue {
    direction: 'higher' | 'lower';
    degraded: number;
    restored: number;
    // Positive when the restoration is better than the degraded input
    improvement: number;
}

// Means over a set of scored clips (the pipeline's "overall" or one "by_category" entry)
export interface MetricSummary {
    items: number;
    metrics: Record<MetricKey, MetricValue>;
}

// One model's metrics on one track, computed on the test split
export interface ModelMetrics {
    trackId: string;
    modelId: string;
    benchmarkVersion: string;
    overall: MetricSummary;
    // By degradation category (the pipeline's category names). Empty for tracks whose
    // degradations are not documented.
    byCategory: Record<string, MetricSummary>;
}

// Degradation effect → category of the pipeline's "by_category" report
// (EFFECT_CATEGORIES in openrestor/metrics/core.py). Effects not listed have no category.
export const EFFECT_CATEGORIES: Record<string, string> = {
    spectral_eq: 'spectral_eq',
    mic: 'mic',
    lowpass: 'lowpass',
    highpass: 'highpass',
    telephone_band: 'telephone_band',
    low_sample_rate: 'low_sample_rate',
    compression: 'compression',
    clipping: 'clipping',
    saturation_overdrive: 'saturation_overdrive',
    reverb_small: 'reverb',
    reverb_big: 'reverb',
    reverb_mix: 'reverb',
    reverb_real: 'reverb',
    distant_mic_capture: 'distant_mic_capture',
    noise: 'noise',
    hum: 'hum',
    clicks_crackle: 'clicks_crackle',
    dropouts_glitches: 'dropouts_glitches',
    codec: 'codec',
    neural_codec: 'neural_codec',
    transcode_chain: 'transcode_chain',
    stereo_collapse: 'stereo_collapse',
    channel_damage: 'channel_damage',
    pitch_speed_instability: 'pitch_speed_instability',
};
