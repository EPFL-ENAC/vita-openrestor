<template>
    <section
        class="split-card"
        :class="{ 'split-card--compact': compact, 'split-card--hidden': split.hidden }"
    >
        <header class="split-card__heading">
            <div class="split-card__identity">
                <div class="split-card__name-row">
                    <h2 class="split-card__name">{{ name }}</h2>
                    <locked-badge v-if="split.hidden" />
                </div>
                <p class="split-card__detail">{{ t(`datasets.splits.${split.id}.detail`) }}</p>
                <p class="split-card__stats">{{ stats }}</p>
            </div>

            <div v-if="!split.hidden" class="split-card__downloads">
                <split-download
                    v-for="part in split.parts"
                    :key="part"
                    :label="t(`datasets.parts.${part}`)"
                    :a11y-label="
                        t('datasets.downloadPart', {
                            part: t(`datasets.parts.${part}`),
                            split: name,
                        })
                    "
                />
            </div>
        </header>

        <div class="split-card__samples">
            <div class="split-card__samples-heading">
                <h3>{{ t('datasets.samples.title') }}</h3>
            </div>

            <ul class="split-card__list">
                <li v-for="sample in split.samples" :key="sample.id">
                    <button
                        type="button"
                        class="split-card__sample"
                        :class="{
                            'split-card__sample--loaded': loadedId === sample.id,
                            'split-card__sample--playing': playingId === sample.id,
                        }"
                        :aria-pressed="playingId === sample.id"
                        :aria-label="
                            t(
                                playingId === sample.id
                                    ? 'datasets.samples.pause'
                                    : 'datasets.samples.play',
                                { sample: sample.id },
                            )
                        "
                        @click="emit('play', split.id, sample)"
                    >
                        <!-- Sound thumb, replaced by play / pause while the row is hovered -->
                        <span class="split-card__marker">
                            <sound-thumb :size="36" :active="loadedId === sample.id" />
                            <span class="split-card__toggle">
                                <q-icon
                                    :name="playingId === sample.id ? 'pause' : 'play_arrow'"
                                    size="20px"
                                />
                            </span>
                        </span>
                        <span class="split-card__sample-identity">
                            <span class="split-card__sample-name">{{ sample.id }}</span>
                            <span class="split-card__sample-detail">
                                {{ sample.degradation }} · {{ sample.severity }}
                            </span>
                        </span>
                        <span class="split-card__sample-length">
                            {{ formatDuration(sample.durationSeconds) }}
                        </span>
                    </button>
                </li>
            </ul>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { sampleTrackId } from 'src/stores/datasets';
import { usePlayerStore } from 'src/stores/player';
import LockedBadge from 'components/LockedBadge.vue';
import SoundThumb from 'components/SoundThumb.vue';
import { formatDuration } from 'components/leaderboard/format';
import SplitDownload from './SplitDownload.vue';
import type { DatasetSample, DatasetSplit, SplitId } from 'src/types/datasets';

// One split of a track: download buttons and a few sample clips. A hidden split shows a
// Locked badge instead of downloads.
// Clicking a clip plays or pauses it in the global player, where the version
// selector switches between original and degraded.
const props = defineProps<{
    trackId: string;
    split: DatasetSplit;
    // Mobile layout
    compact?: boolean;
}>();

const emit = defineEmits<{
    play: [splitId: SplitId, sample: DatasetSample];
}>();

const { t, n, locale } = useI18n();
const player = usePlayerStore();

const name = computed(() => t(`datasets.splits.${props.split.id}.name`));

const GB = 1e9;
const TB = 1e12;

function formatSize(bytes: number): string {
    const [value, unit] = bytes >= TB ? [bytes / TB, 'TB'] : [bytes / GB, 'GB'];
    const number = new Intl.NumberFormat(locale.value, { maximumFractionDigits: 1 }).format(value);
    return `${number} ${unit}`;
}

const stats = computed(() =>
    [
        t('datasets.clips', { n: n(props.split.clipCount) }),
        props.split.sizeBytes === null
            ? t('datasets.notDownloadable')
            : formatSize(props.split.sizeBytes),
        props.split.hidden ? null : t('datasets.contents.pairs'),
    ]
        .filter(Boolean)
        .join(' · '),
);

// Sample of this split that is in the player, if any
const loadedId = computed(() => {
    const prefix = sampleTrackId(props.trackId, props.split.id, '');
    const id = player.track?.id;
    return id?.startsWith(prefix) ? id.slice(prefix.length) : null;
});

const playingId = computed(() => (player.isPlaying ? loadedId.value : null));
</script>

<style scoped lang="scss">
.split-card {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    border-radius: var(--or-radius-lg);
    background: var(--or-bg-raised);

    p,
    h2,
    h3 {
        margin: 0;
    }

    &__heading {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
    }

    &__identity {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
    }

    &__name-row {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    &__name {
        font-family: inherit;
        font-size: 18px;
        font-weight: 800;
        line-height: 1.25;
    }

    &__detail {
        color: var(--or-text-soft);
        font-size: 14px;
        line-height: 1.4;
    }

    &__stats {
        color: var(--or-text-muted);
        font-size: 13px;
    }

    &__downloads {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    &__samples {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding-top: 16px;
        border-top: 1px solid var(--or-border);
    }

    &__samples-heading {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 4px 10px;
        margin-bottom: 4px;

        h3 {
            color: var(--or-text-subtle);
            font-family: inherit;
            font-size: 12px;
            font-weight: 700;
            line-height: 1.4;
            letter-spacing: 0.04em;
            text-transform: uppercase;
        }
    }

    &__list {
        display: flex;
        flex-direction: column;
        gap: 2px;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    &__sample {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        min-height: 56px;
        padding: 6px 12px;
        border: 0;
        border-radius: var(--or-radius-sm);
        background: transparent;
        color: var(--or-text);
        font: inherit;
        text-align: left;
        cursor: pointer;

        &:hover,
        &--loaded {
            background: var(--or-bg-control);
        }

        &:hover .split-card__toggle {
            display: flex;
        }
    }

    &__sample-identity {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
    }

    &__sample-name {
        overflow: hidden;
        font-size: 14px;
        font-weight: 700;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &__sample-detail,
    &__sample-length {
        color: var(--or-text-muted);
        font-size: 13px;
    }

    &__sample-length {
        flex-shrink: 0;
        font-variant-numeric: tabular-nums;
    }

    &__marker {
        position: relative;
        display: flex;
        flex-shrink: 0;
    }

    &__toggle {
        position: absolute;
        inset: 0;
        display: none;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: var(--or-text);
        color: var(--or-text-on-accent);
    }

    &__sample--loaded {
        .split-card__sample-name {
            color: var(--q-primary);
        }

        .split-card__toggle {
            background: var(--q-primary);
            color: var(--or-text);
        }
    }

    &--compact {
        gap: 16px;
        padding: 16px;

        .split-card__name {
            font-size: 16px;
        }

        .split-card__sample {
            padding: 6px 8px;
        }
    }
}
</style>
