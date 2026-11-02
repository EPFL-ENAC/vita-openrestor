// Fake leaderboard endpoint backed by src/mocks/leaderboard.json.
// Swapping it for a real HTTP call later only changes this file.
import mock from 'src/mocks/leaderboard.json';
import audio from 'src/mocks/audio.json';
import type { TrackLeaderboard } from 'src/types/leaderboard';
import { respond } from './respond';

// GET /leaderboard/:trackId: approved models scored on one track, with the test samples
export function fetchLeaderboard(trackId: string): Promise<TrackLeaderboard> {
    const track = mock.tracks.find((t) => t.trackId === trackId);
    if (!track) {
        return Promise.reject(new Error(`Unknown track "${trackId}"`));
    }
    const scores: Record<string, number[]> = track.scores;
    const sampleScores: Record<string, number[]> = track.sampleScores;
    const result: TrackLeaderboard = {
        trackId,
        release: mock.release,
        entries: mock.models.map((model) => {
            const score = scores[model.id];
            if (!score || score.length !== 2) {
                throw new Error(`No score for "${model.id}" on "${trackId}"`);
            }
            const [snrGain, listening] = score as [number, number];
            // SNR gain on each test sample, in the order of the samples
            const perSample = sampleScores[model.id];
            if (!perSample || perSample.length !== track.samples.length) {
                throw new Error(`No per-sample scores for "${model.id}" on "${trackId}"`);
            }
            const sampleSnr = Object.fromEntries(
                track.samples.map((sample, i) => [sample.id, perSample[i] as number]),
            );
            return { model, snrGain, listening, sampleSnr };
        }),
        samples: track.samples.map((sample) => ({
            ...sample,
            // Every clip uses the same mock audio until the API serves real clips
            audio: { original: audio.original, degraded: audio.degraded },
        })),
    };
    return respond(result);
}

// GET /leaderboard/:trackId/models/:modelId/restored/:sampleId
export function restoredAudioUrl(trackId: string, modelId: string, sampleId: string): string {
    void trackId;
    void modelId;
    void sampleId;
    return audio.restored;
}
