import type { MetricKey } from 'src/types/metrics';

// Unit and decimals of each metric, as the pipeline reports them
export const METRIC_DISPLAY: Record<MetricKey, { unit: string; decimals: number }> = {
    snr_db: { unit: 'dB', decimals: 1 },
    si_sdr_db: { unit: 'dB', decimals: 1 },
    si_snr_db: { unit: 'dB', decimals: 1 },
    l1: { unit: '', decimals: 4 },
    rmse: { unit: '', decimals: 4 },
    lsd_db: { unit: 'dB', decimals: 2 },
    mrstft: { unit: '', decimals: 3 },
    log_mel: { unit: '', decimals: 2 },
    ltas: { unit: '', decimals: 3 },
    log_mel_ssim: { unit: '', decimals: 3 },
    spectral_kl: { unit: '', decimals: 3 },
    rt60_s: { unit: 's', decimals: 2 },
    drr_db: { unit: 'dB', decimals: 1 },
    late_tail_db: { unit: 'dB', decimals: 1 },
    aae: { unit: '', decimals: 3 },
    clap_cosine: { unit: '', decimals: 3 },
    fadtk_clean: { unit: '', decimals: 3 },
    fadtk_fma_pop: { unit: '', decimals: 3 },
    audiobox_ce: { unit: '', decimals: 2 },
    audiobox_cu: { unit: '', decimals: 2 },
    audiobox_pc: { unit: '', decimals: 2 },
    audiobox_pq: { unit: '', decimals: 2 },
};
