// A track is one benchmark dataset (SyntheticSimple, synthetic_blind, real_blind).
// Every model is scored on every track, so the same ids drive the datasets page
// and the leaderboard tabs.
export interface DatasetTrack {
    id: string;
    name: string;
    description: string;
    // How degraded versions relate to an original clip, e.g. "21, ordered" or "1, random"
    versionsPerClip: string;
    degradations: string[];
    splits: DatasetSplit[];
}

// Both splits are public. Submitted models run on the test split, which gives the scores.
export type SplitId = 'train' | 'test';

// What a download button fetches: the original or the degraded half of a split
export type SplitPart = 'original' | 'degraded';

export interface DatasetSplit {
    id: SplitId;
    clipCount: number;
    // null when the split cannot be downloaded
    sizeBytes: number | null;
    // A hidden split is listed but cannot be downloaded
    hidden: boolean;
    parts: SplitPart[];
    // A few clips anyone can play on the page
    samples: DatasetSample[];
}

export interface DatasetSample {
    id: string;
    degradation: string;
    severity: string;
    durationSeconds: number;
    audio: { original: string; degraded: string };
}

export interface DatasetInfo {
    version: string;
    clipSeconds: number;
    audioFormat: string;
    metadataStandards: string[];
    // Not chosen yet (Creative Commons or MIT)
    licence: string;
}

export interface DatasetCatalog {
    dataset: DatasetInfo;
    tracks: DatasetTrack[];
}
