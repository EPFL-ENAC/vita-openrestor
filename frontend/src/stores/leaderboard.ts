import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { fetchLeaderboard, restoredAudioUrl } from 'src/api/leaderboard';
import { fetchModelMetrics } from 'src/api/metrics';
import type { ModelMetrics } from 'src/types/metrics';
import { usePlayerStore, type AudioVersion } from 'src/stores/player';
import { useSubmissionsStore } from 'src/stores/submissions';
import type {
    LeaderboardEntry,
    LeaderboardSort,
    TestSample,
    TrackLeaderboard,
} from 'src/types/leaderboard';

const PEAK_COUNT = 240;

// Deterministic fake waveform, seeded by a string
export function peaksFor(seed: string): number[] {
    let state = [...seed].reduce((sum, c) => (sum * 31 + c.charCodeAt(0)) % 4294967296, 7);
    const next = () => {
        state = (state * 1664525 + 1013904223) % 4294967296;
        return state / 4294967296;
    };
    return Array.from({ length: PEAK_COUNT }, () => 0.08 + 0.92 * next() ** 2);
}

// Player track id of one model's restoration of one sample
function playerTrackId(trackId: string, modelId: string, sampleId: string): string {
    return `${trackId}/${modelId}/${sampleId}`;
}

export const useLeaderboardStore = defineStore('leaderboard', () => {
    const player = usePlayerStore();
    const submissions = useSubmissionsStore();

    const board = ref<TrackLeaderboard | null>(null);
    const sort = ref<LeaderboardSort>('snrGain');
    const loading = ref(false);
    let requestId = 0;

    // Best first; the rank is the position in this order
    const ranked = computed<LeaderboardEntry[]>(() => {
        const entries = [...(board.value?.entries ?? [])];
        return entries.sort((a, b) => b[sort.value] - a[sort.value]);
    });

    // Which model and sample are in the player, if they belong to this board
    const nowPlaying = computed(() => {
        const current = board.value;
        const id = player.track?.id;
        if (!current || !id) {
            return null;
        }
        for (const entry of current.entries) {
            for (const sample of current.samples) {
                if (playerTrackId(current.trackId, entry.model.id, sample.id) === id) {
                    return { entry, sample };
                }
            }
        }
        return null;
    });

    async function load(trackId: string) {
        const id = ++requestId;
        loading.value = true;
        try {
            // My models are shown distinctly, so know which ones they are (no sidebar on mobile)
            const [data] = await Promise.all([fetchLeaderboard(trackId), submissions.load()]);
            // Ignore a response that arrives after a newer track was picked
            if (id === requestId) {
                board.value = data;
            }
        } finally {
            if (id === requestId) {
                loading.value = false;
            }
        }
    }

    function entry(modelId: string): LeaderboardEntry | null {
        return board.value?.entries.find((e) => e.model.id === modelId) ?? null;
    }

    function rank(modelId: string): number {
        return ranked.value.findIndex((e) => e.model.id === modelId) + 1;
    }

    // True when this model (and this sample, if given) is loaded in the player
    function isLoaded(target: LeaderboardEntry, sampleId?: string): boolean {
        const current = nowPlaying.value;
        return (
            current?.entry.model.id === target.model.id &&
            (sampleId === undefined || current.sample.id === sampleId)
        );
    }

    function isPlaying(target: LeaderboardEntry, sampleId?: string): boolean {
        return isLoaded(target, sampleId) && player.isPlaying;
    }

    // Play a model's restoration of a sample (the track's preview clip by default).
    // Same sound again: pause or resume. With a version: switch to it at the same position.
    async function play(
        target: LeaderboardEntry,
        trackName: string,
        sample?: TestSample,
        version?: AudioVersion,
    ) {
        const current = board.value;
        const clip = sample ?? current?.samples[0];
        if (!current || !clip) {
            throw new Error('Leaderboard not loaded');
        }
        const id = playerTrackId(current.trackId, target.model.id, clip.id);
        if (player.track?.id === id) {
            if (version && version !== player.version) {
                await player.setVersion(version);
            } else {
                await player.toggle();
            }
            return;
        }
        await player.load(
            {
                id,
                title: clip.id,
                attribution: `${target.model.name} · ${trackName}`,
                sources: {
                    ...clip.audio,
                    restored: restoredAudioUrl(current.trackId, target.model.id, clip.id),
                },
                peaks: peaksFor(id),
            },
            version ?? 'restored',
        );
    }

    // Every pipeline metric of one model on one track (not cached: small and rarely reopened)
    function loadMetrics(trackId: string, modelId: string): Promise<ModelMetrics> {
        return fetchModelMetrics(trackId, modelId);
    }

    return {
        board,
        sort,
        loading,
        ranked,
        nowPlaying,
        load,
        entry,
        rank,
        isLoaded,
        isPlaying,
        play,
        loadMetrics,
    };
});
