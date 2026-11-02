// The leaderboard ranks models. Each row is a model's approved submission (one per model),
// scored on one track (dataset). Sounds are test-set clips restored by that model.
export interface ModelCard {
    approvedAt: string;
    architecture: string;
    parameters: string;
    trainedOn: string;
    links: { code: string | null; weights: string | null; paper: string | null };
}

export interface RankedModel {
    id: string;
    name: string;
    lab: string;
    card: ModelCard;
}

export interface LeaderboardEntry {
    model: RankedModel;
    // Mean SNR gain over the degraded input, in dB
    snrGain: number;
    // Mean rating from listening tests
    listening: number;
    // SNR gain on each test sample, by sample id
    sampleSnr: Record<string, number>;
}

export type LeaderboardSort = 'snrGain' | 'listening';

// A public test clip. Every model restores the same clips, so they can be compared by ear.
export interface TestSample {
    id: string;
    degradation: string;
    severity: string;
    durationSeconds: number;
    audio: { original: string; degraded: string };
}

export interface TrackLeaderboard {
    trackId: string;
    release: string;
    entries: LeaderboardEntry[];
    // The first one is the track's preview clip (played from the podium)
    samples: TestSample[];
}
