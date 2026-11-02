import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { fetchCatalog } from 'src/api/datasets';
import { peaksFor } from 'src/stores/leaderboard';
import { usePlayerStore, type AudioVersion } from 'src/stores/player';
import type { DatasetCatalog, DatasetSample, SplitId } from 'src/types/datasets';

// Player track id of one sample clip
export function sampleTrackId(trackId: string, splitId: SplitId, sampleId: string): string {
    return `datasets/${trackId}/${splitId}/${sampleId}`;
}

export const useDatasetsStore = defineStore('datasets', () => {
    const player = usePlayerStore();
    const catalog = ref<DatasetCatalog | null>(null);
    const trackId = ref<string | null>(null);

    const track = computed(() => catalog.value?.tracks.find((t) => t.id === trackId.value) ?? null);

    async function load() {
        const data = await fetchCatalog();
        catalog.value = data;
        if (!data.tracks.some((t) => t.id === trackId.value)) {
            trackId.value = data.tracks[0]?.id ?? null;
        }
    }

    function selectTrack(id: string) {
        if (!catalog.value?.tracks.some((t) => t.id === id)) {
            throw new Error(`Unknown track "${id}"`);
        }
        trackId.value = id;
    }

    // Play a sample clip of the selected track, or pause it if it is loaded. A new clip starts
    // in the version the player is on (degraded by default); the player switches versions.
    async function play(splitId: SplitId, splitName: string, sample: DatasetSample) {
        if (!track.value) {
            throw new Error('No track selected');
        }
        const id = sampleTrackId(track.value.id, splitId, sample.id);
        if (player.track?.id === id) {
            await player.toggle();
            return;
        }
        const version: AudioVersion = player.version === 'original' ? 'original' : 'degraded';
        await player.load(
            {
                id,
                title: sample.id,
                attribution: `${track.value.name} · ${splitName}`,
                sources: sample.audio,
                peaks: peaksFor(id),
            },
            version,
        );
    }

    return { catalog, trackId, track, load, selectTrack, play };
});
