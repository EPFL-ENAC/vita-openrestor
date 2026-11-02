import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

export const AUDIO_VERSIONS = ['original', 'degraded', 'restored'] as const;
export type AudioVersion = (typeof AUDIO_VERSIONS)[number];

export interface PlayerTrack {
    id: string;
    title: string;
    attribution: string;
    // Audio URL per available version (the dataset page only has original and degraded)
    sources: Partial<Record<AudioVersion, string>>;
    // Waveform peaks, 0..1
    peaks: number[];
}

// Global audio player. The audio element lives here so playback continues across pages.
export const usePlayerStore = defineStore('player', () => {
    const audio = new Audio();

    const track = ref<PlayerTrack | null>(null);
    const version = ref<AudioVersion>('restored');
    const isPlaying = ref(false);
    const currentTime = ref(0);
    const duration = ref(0);
    const muted = ref(false);

    const versions = computed(() =>
        AUDIO_VERSIONS.filter((v) => track.value?.sources[v] !== undefined),
    );
    const progress = computed(() => (duration.value > 0 ? currentTime.value / duration.value : 0));

    audio.addEventListener('timeupdate', () => (currentTime.value = audio.currentTime));
    // Where to seek once the current source has loaded, after a version switch. One value for
    // the whole store, so a newer switch or a new track replaces it instead of adding a
    // second seek that runs later.
    let pendingSeek: number | null = null;

    audio.addEventListener('loadedmetadata', () => {
        duration.value = audio.duration;
        if (pendingSeek !== null) {
            audio.currentTime = pendingSeek;
            pendingSeek = null;
        }
    });
    audio.addEventListener('play', () => (isPlaying.value = true));
    audio.addEventListener('pause', () => (isPlaying.value = false));

    function sourceFor(next: AudioVersion): string {
        const src = track.value?.sources[next];
        if (src === undefined) {
            throw new Error(`Track has no "${next}" version`);
        }
        return src;
    }

    async function load(next: PlayerTrack, nextVersion: AudioVersion = 'restored') {
        track.value = next;
        version.value = nextVersion;
        currentTime.value = 0;
        duration.value = 0;
        // A new track starts at 0, not where a previous switch meant to go
        pendingSeek = null;
        audio.src = sourceFor(nextVersion);
        await audio.play();
    }

    async function toggle() {
        if (audio.paused) {
            await audio.play();
        } else {
            audio.pause();
        }
    }

    function pause() {
        audio.pause();
    }

    function seek(fraction: number) {
        if (duration.value > 0) {
            audio.currentTime = fraction * duration.value;
        }
    }

    // Switch between original / degraded / restored at the same position
    async function setVersion(next: AudioVersion) {
        // While a previous switch is still loading, its source is at 0: keep its position
        const position = pendingSeek ?? audio.currentTime;
        const wasPlaying = !audio.paused;
        version.value = next;
        pendingSeek = position;
        audio.src = sourceFor(next);
        if (wasPlaying) {
            await audio.play();
        }
    }

    function toggleMute() {
        muted.value = !muted.value;
        audio.muted = muted.value;
    }

    return {
        track,
        version,
        versions,
        isPlaying,
        currentTime,
        duration,
        progress,
        muted,
        load,
        toggle,
        pause,
        seek,
        setVersion,
        toggleMute,
    };
});
