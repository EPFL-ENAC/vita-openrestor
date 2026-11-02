<template>
    <section
        class="audio-player"
        :class="compact ? 'audio-player--mobile' : 'audio-player--desktop'"
    >
        <div class="audio-player__track">
            <button
                type="button"
                class="audio-player__playback"
                :aria-disabled="!player.track"
                :aria-label="player.isPlaying ? t('player.pause') : t('player.play')"
                @click="player.track && player.toggle()"
            >
                <img :src="playbackIcon" :width="buttonSize" :height="buttonSize" alt="" />
            </button>

            <div class="audio-player__identity">
                <span class="audio-player__title">{{
                    player.track?.title ?? t('player.nothingPlaying')
                }}</span>
                <span class="audio-player__attribution text-muted">
                    {{ player.track?.attribution ?? t('player.addFiles') }}
                </span>
            </div>

            <button
                v-if="compact && player.track"
                type="button"
                class="audio-player__version-badge"
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
                class="audio-player__volume audio-player__volume--muted"
                :aria-label="t('player.unmute')"
                :aria-pressed="true"
                @click="player.toggleMute()"
            >
                <app-icon :src="volumeIcon" :size="16" />
            </button>
        </div>

        <div class="audio-player__timeline">
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
            <div v-if="!compact" class="audio-player__times">
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
                class="audio-player__volume"
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
.audio-player {
    border-top: 1px solid var(--or-border);
    color: var(--or-text);

    &__track {
        display: flex;
        align-items: center;
    }

    &__playback {
        display: flex;
        flex-shrink: 0;
        padding: 0;
        border: 0;
        background: none;
        cursor: pointer;

        &[aria-disabled='true'] {
            cursor: default;
        }
    }

    &__identity {
        display: flex;
        flex: 1 1 0;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
        line-height: 1.25;
        white-space: nowrap;
    }

    &__title {
        overflow: hidden;
        font-size: 14px;
        font-weight: 800;
        text-overflow: ellipsis;
    }

    &__attribution {
        overflow: hidden;
        font-size: 12px;
        text-overflow: ellipsis;
    }

    &__times {
        display: flex;
        justify-content: space-between;
        height: 15px;
        font-size: 12px;
        line-height: 1.25;
    }

    &__volume {
        display: flex;
        flex-shrink: 0;
        padding: 0;
        border: 0;
        background: none;
        color: var(--or-text);
        cursor: pointer;

        &--muted {
            color: var(--or-text-subtle);
        }
    }

    &__version-badge {
        flex-shrink: 0;
        height: 22px;
        padding: 0 10px;
        border: 0;
        border-radius: var(--or-radius-pill);
        background: var(--q-accent);
        color: var(--or-text-on-accent);
        font: inherit;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
    }

    &--desktop {
        display: flex;
        align-items: center;
        gap: 24px;
        height: 120px;
        padding: 0 24px;
        background: var(--or-bg-sunken);

        .audio-player__track {
            gap: 14px;
            width: 304px;
            flex-shrink: 0;
        }

        .audio-player__timeline {
            display: flex;
            flex: 1 1 0;
            flex-direction: column;
            gap: 8px;
            min-width: 0;
        }

        // Bottom margin equal to the time row and its gap under the waveform, so the
        // version selector and volume sit on the waveform's centre line
        .version-selector,
        .audio-player__volume {
            margin-bottom: 18px;
        }
    }

    &--mobile {
        display: flex;
        flex-direction: column;
        gap: 8px;
        height: 98px;
        padding: 10px 16px 0;
        background: var(--or-bg-surface);

        .audio-player__track {
            gap: 12px;
        }
    }
}
</style>
