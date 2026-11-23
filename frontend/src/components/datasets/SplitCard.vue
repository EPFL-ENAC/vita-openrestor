<template>
    <section
        class="split-card column no-wrap rounded-lg bg-raised"
        :class="{ 'split-card--compact': compact, 'split-card--hidden': split.hidden }"
    >
        <header class="split-card__heading row items-start justify-between">
            <div class="split-card__identity column no-wrap">
                <div class="split-card__name-row row no-wrap items-center">
                    <h2 class="text-h5 q-ma-none">{{ name }}</h2>
                    <locked-badge v-if="split.hidden" />
                </div>
                <p class="text-body1 text-soft q-ma-none">
                    {{ t(`datasets.splits.${split.id}.detail`) }}
                </p>
                <p class="text-body2 text-muted q-ma-none">{{ stats }}</p>
            </div>

            <div v-if="!split.hidden" class="split-card__downloads row">
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
            <h3 class="text-overline text-subtle q-mt-none q-mb-sm">
                {{ t('datasets.samples.title') }}
            </h3>

            <ul class="split-card__list column no-wrap q-ma-none q-pa-none">
                <li v-for="sample in split.samples" :key="sample.id">
                    <button
                        type="button"
                        class="split-card__sample plain-button row no-wrap items-center full-width text-left rounded-sm"
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
                        <span class="relative-position flex col-auto">
                            <sound-thumb :size="36" :active="loadedId === sample.id" />
                            <span
                                class="split-card__toggle absolute-full items-center justify-center"
                            >
                                <q-icon
                                    :name="playingId === sample.id ? matPause : matPlayArrow"
                                    size="20px"
                                />
                            </span>
                        </span>
                        <span class="split-card__sample-identity col column no-wrap">
                            <span class="split-card__sample-name text-subtitle2 ellipsis">
                                {{ sample.id }}
                            </span>
                            <span class="text-body2 text-muted">
                                {{ sample.degradation }} · {{ sample.severity }}
                            </span>
                        </span>
                        <span class="split-card__sample-length col-auto text-body2 text-muted">
                            {{ formatDuration(sample.durationSeconds, locale) }}
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
import { matPause, matPlayArrow } from '@quasar/extras/material-icons';
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
// Typography, flex, colors and radius come from the global classes in the template.
// Only the gaps, row sizes and hover / loaded states of the card stay here.
.split-card {
    gap: var(--or-spacing-md-lg);
    padding: var(--or-spacing-md-lg);

    &__heading {
        gap: var(--or-spacing-md);
    }

    &__identity {
        gap: var(--or-spacing-xs);
        min-width: 0;
    }

    &__name-row {
        gap: var(--or-spacing-sm);
    }

    &__downloads {
        gap: var(--or-spacing-sm);
    }

    &__samples {
        padding-top: var(--or-spacing-md);
        border-top: 1px solid var(--or-border);
    }

    &__list {
        gap: var(--or-spacing-xxs);
        list-style: none;
    }

    &__sample {
        gap: var(--or-spacing-sm-md);
        min-height: 56px;
        padding: var(--or-spacing-xs) var(--or-spacing-sm-md);
        color: var(--or-text);

        &:hover,
        &--loaded {
            background: var(--or-bg-control);
        }

        &:hover .split-card__toggle {
            display: flex;
        }
    }

    &__sample-identity {
        gap: var(--or-spacing-xxs);
    }

    &__sample-length {
        font-variant-numeric: tabular-nums;
    }

    // Hidden until the row is hovered (display is switched in &__sample:hover)
    &__toggle {
        display: none;
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
        gap: var(--or-spacing-md);
        padding: var(--or-spacing-md);

        .split-card__sample {
            padding: var(--or-spacing-xs) var(--or-spacing-sm);
        }
    }
}
</style>
