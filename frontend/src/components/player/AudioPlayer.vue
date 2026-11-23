<template>
    <section
        class="audio-player no-wrap"
        :class="
            compact
                ? 'audio-player--mobile column bg-surface'
                : 'audio-player--desktop row items-center bg-sunken'
        "
    >
        <div class="audio-player__track row no-wrap items-center">
            <button
                type="button"
                class="audio-player__playback plain-button flex col-auto"
                :aria-disabled="!player.track"
                :aria-label="player.isPlaying ? t('player.pause') : t('player.play')"
                @click="player.track && player.toggle()"
            >
                <img :src="playbackIcon" :width="buttonSize" :height="buttonSize" alt="" />
            </button>

            <div class="audio-player__identity col column no-wrap">
                <span class="text-subtitle2 text-weight-bolder ellipsis">{{
                    player.track?.title ?? t('player.nothingPlaying')
                }}</span>
                <span class="text-caption text-muted ellipsis">
                    {{ player.track?.attribution ?? t('player.addFiles') }}
                </span>
            </div>

            <button
                v-if="compact && player.track"
                type="button"
                class="audio-player__version-badge plain-button col-auto rounded-pill bg-accent text-on-accent text-caption text-weight-bolder"
                :aria-label="t('player.version')"
                @click="cycleVersion"
            >
                {{ t(`player.versions.${player.version}`) }}
            </button>
            <!-- Mobile has no volume control; while muted (e.g. from desktop) it shows the
                 button, so the sound can be turned back on -->
            <button
                v-if="compact && player.muted"
                type="button"
                class="audio-player__volume audio-player__volume--muted plain-button flex col-auto"
                :aria-label="t('player.unmute')"
                :aria-pressed="true"
                @click="player.toggleMute()"
            >
                <app-icon :src="volumeIcon" :size="16" />
            </button>
        </div>

        <div class="audio-player__timeline column no-wrap" :class="{ col: !compact }">
            <audio-waveform
                :peaks="player.track?.peaks ?? IDLE_WAVEFORM"
                :progress="player.progress"
                :height="compact ? 30 : 50"
                :idle="!player.track"
                :seek-label="t('player.seek')"
                :value-text="
                    t('player.position', {
                        current: formatTime(player.currentTime),
                        total: formatTime(player.duration),
                    })
                "
                :step="player.duration > 0 ? SEEK_STEP_SECONDS / player.duration : undefined"
                @seek="player.seek"
            />
            <div
                v-if="!compact"
                class="audio-player__times row no-wrap justify-between text-caption"
            >
                <template v-if="player.track">
                    <span class="text-primary">{{ formatTime(player.currentTime) }}</span>
                    <span>{{ formatTime(player.duration) }}</span>
                </template>
            </div>
        </div>

        <template v-if="!compact">
            <version-selector
                v-if="player.track"
                :model-value="player.version"
                :versions="player.versions"
                @update:model-value="player.setVersion"
            />
            <button
                type="button"
                class="audio-player__volume plain-button flex col-auto"
                :class="{ 'audio-player__volume--muted': player.muted }"
                :aria-label="player.muted ? t('player.unmute') : t('player.mute')"
                :aria-pressed="player.muted"
                @click="player.toggleMute()"
            >
                <app-icon :src="volumeIcon" :size="16" />
            </button>
        </template>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePlayerStore } from 'src/stores/player';
import AppIcon from 'components/AppIcon.vue';
import AudioWaveform from './AudioWaveform.vue';
import VersionSelector from './VersionSelector.vue';
import { IDLE_WAVEFORM } from 'src/constants/waveform';
import playIcon52 from 'assets/icons/play-accent-52.svg';
import pauseIcon52 from 'assets/icons/pause-accent-52.svg';
import playIcon44 from 'assets/icons/play-accent-44.svg';
import pauseIcon44 from 'assets/icons/pause-accent-44.svg';
import volumeIcon from 'assets/icons/volume-16.svg';

const props = defineProps<{
    // Mobile layout: smaller button, version badge instead of selector, no time labels
    compact?: boolean;
}>();

const player = usePlayerStore();
const { t } = useI18n();

const buttonSize = computed(() => (props.compact ? 44 : 52));
const playbackIcon = computed(() => {
    if (props.compact) {
        return player.isPlaying ? pauseIcon44 : playIcon44;
    }
    return player.isPlaying ? pauseIcon52 : playIcon52;
});

async function cycleVersion() {
    const index = player.versions.indexOf(player.version);
    const next = player.versions[(index + 1) % player.versions.length];
    if (next !== undefined) {
        await player.setVersion(next);
    }
}

// How far one arrow key moves on the waveform
const SEEK_STEP_SECONDS = 5;

function formatTime(seconds: number): string {
    const whole = Math.floor(seconds);
    return `${String(Math.floor(whole / 60)).padStart(2, '0')}:${String(whole % 60).padStart(2, '0')}`;
}
</script>

<style scoped lang="scss">
// Typography, flex and backgrounds come from the global classes in the template.
// Only the sizes, gaps and the muted state of the player stay here.
.audio-player {
    border-top: 1px solid var(--or-border);
    color: var(--or-text);

    &__track {
        gap: var(--or-spacing-sm-md);
    }

    &__playback[aria-disabled='true'] {
        cursor: default;
    }

    &__identity {
        gap: var(--or-spacing-xxs);
    }

    &__timeline {
        gap: var(--or-spacing-sm);
    }

    &__times {
        height: 15px;
    }

    &__volume--muted {
        color: var(--or-text-subtle);
    }

    &__version-badge {
        height: 22px;
        padding: 0 var(--or-spacing-sm);
    }

    &--desktop {
        gap: var(--or-spacing-lg);
        height: 120px;
        padding: 0 var(--or-spacing-lg);

        .audio-player__track {
            width: 304px;
            flex-shrink: 0;
        }

        // Bottom margin close to the time row and its gap under the waveform, so the
        // version selector and volume sit near the waveform's centre line
        .version-selector,
        .audio-player__volume {
            margin-bottom: var(--or-spacing-md);
        }
    }

    &--mobile {
        gap: var(--or-spacing-sm);
        height: 98px;
        padding: var(--or-spacing-sm) var(--or-spacing-md) 0;
    }
}
</style>
