<template>
    <div class="sample-table column no-wrap" :class="{ 'sample-table--compact': compact }">
        <div
            v-if="!compact"
            class="sample-table__row sample-table__head row no-wrap items-start q-mt-xs text-overline text-muted"
        >
            <span class="sample-table__index">#</span>
            <span class="sample-table__marker" />
            <span class="col">{{ t('leaderboard.samples.columns.sample') }}</span>
            <span class="sample-table__degradation">
                {{ t('leaderboard.samples.columns.degradation') }}
            </span>
            <span class="sample-table__snr">{{ t('leaderboard.columns.snrGain') }}</span>
            <span class="sample-table__length">{{ t('leaderboard.samples.columns.length') }}</span>
        </div>

        <!-- One block for the rows, so the gap above only separates them from the head -->
        <div>
            <div
                v-for="(sample, index) in samples"
                :key="sample.id"
                class="sample-table__row sample-table__sample row no-wrap items-center relative-position cursor-pointer"
                :class="{
                    'sample-table__sample--selected': sample.id === selectedId,
                    'sample-table__sample--playing': sample.id === playingId,
                }"
            >
                <!-- Covers the whole row: clicking anywhere plays the sample, except on the
                     degradation tag, which sits above it -->
                <button
                    type="button"
                    class="sample-table__hit plain-button absolute-full"
                    :aria-pressed="sample.id === selectedId"
                    :aria-label="
                        sample.id === playingId
                            ? t('leaderboard.samples.pause', { sample: sample.id })
                            : t('leaderboard.samples.play', { sample: sample.id })
                    "
                    @click="emit('select', sample)"
                />
                <!-- Number, replaced by play / pause while the row is hovered -->
                <span
                    v-if="!compact"
                    class="sample-table__index row no-wrap items-center text-subtitle1 text-muted"
                >
                    <span class="sample-table__number">{{ index + 1 }}</span>
                    <q-icon
                        class="sample-table__toggle"
                        :name="sample.id === playingId ? matPause : matPlayArrow"
                        size="20px"
                    />
                </span>
                <span class="sample-table__marker flex">
                    <sound-thumb :size="36" :active="sample.id === selectedId" />
                </span>
                <span class="sample-table__identity col column no-wrap">
                    <span class="sample-table__name text-subtitle2 ellipsis">{{ sample.id }}</span>
                    <span class="text-body2 text-muted">
                        {{
                            compact
                                ? `${sample.degradation} · ${sample.severity}`
                                : t('leaderboard.samples.severity', { severity: sample.severity })
                        }}
                    </span>
                </span>
                <span v-if="!compact" class="sample-table__degradation">
                    <button
                        v-if="categoryOf?.(sample.degradation)"
                        type="button"
                        class="sample-table__badge sample-table__badge--link plain-button text-caption text-weight-bold"
                        :title="
                            t('leaderboard.samples.showCategory', {
                                category: categoryOf(sample.degradation),
                            })
                        "
                        @click="emit('category', categoryOf(sample.degradation) ?? '')"
                    >
                        {{ sample.degradation }}
                    </button>
                    <span v-else class="sample-table__badge text-caption text-weight-bold">
                        {{ sample.degradation }}
                    </span>
                </span>
                <span class="sample-table__snr text-subtitle2">
                    {{ formatSnr(snr[sample.id] ?? 0) }}
                </span>
                <span v-if="!compact" class="sample-table__length text-body1 text-muted">
                    {{ formatDuration(sample.durationSeconds, locale) }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { matPause, matPlayArrow } from '@quasar/extras/material-icons';
import SoundThumb from 'components/SoundThumb.vue';
import { formatDuration, formatSnr } from './format';
import type { TestSample } from 'src/types/leaderboard';

// Test samples restored by one model (organism/Upload/Restored samples).
// Numbered in the track's sample order (not a ranking). Clicking a sample plays it, or
// pauses it if it is already playing; hovering a row shows that action in place of its number.
// Clicking a degradation tag shows the metrics of its category instead (when there are some).
defineProps<{
    samples: TestSample[];
    // This model's SNR gain per sample id
    snr: Record<string, number>;
    selectedId: string | null;
    // Sample currently playing (not paused), if any
    playingId: string | null;
    compact?: boolean;
    // Metrics category of a degradation, when the metrics have one: its tag becomes a button
    categoryOf?: (degradation: string) => string | null;
}>();

const emit = defineEmits<{ select: [sample: TestSample]; category: [category: string] }>();

const { t, locale } = useI18n();
</script>

<style scoped lang="scss">
// Typography and flex come from the global classes in the template.
// Only the column widths, row sizes, the badge and the hover / selected / playing states stay here.
.sample-table {
    gap: var(--or-spacing-sm);

    &__row {
        padding: 0 var(--or-spacing-md);
    }

    &__head {
        height: 30px;
        border-bottom: 1px solid var(--or-border);
    }

    &__sample {
        height: 56px;
        border-radius: var(--or-radius-md);
        color: var(--or-text);

        &:hover {
            background: var(--or-bg-surface);
        }

        &:has(.sample-table__hit:focus-visible) {
            outline: 2px solid var(--or-border-strong);
        }

        &--selected,
        &--selected:hover {
            background: var(--or-bg-control);

            .sample-table__name {
                color: var(--q-primary);
            }
        }
    }

    &__hit {
        border-radius: inherit;
        outline: 0;
    }

    &__index {
        flex: 0 0 44px;
    }

    // -2px: optical nudge so the icon's left edge lines up with the numbers
    &__toggle {
        display: none;
        margin-left: -2px;
        color: var(--or-text);
    }

    &__sample:hover,
    &__sample:has(.sample-table__hit:focus-visible) {
        .sample-table__number {
            display: none;
        }

        .sample-table__toggle {
            display: inline-flex;
        }
    }

    &__sample--selected .sample-table__number,
    &__sample--playing .sample-table__toggle {
        color: var(--q-primary);
    }

    &__marker {
        flex: 0 0 48px;
    }

    &__identity {
        gap: var(--or-spacing-xxs);
    }

    &__degradation {
        flex: 0 0 156px;
    }

    // Colors stay here, not in classes: the link's hover changes them
    &__badge {
        padding: var(--or-spacing-xxs) var(--or-spacing-sm);
        border-radius: var(--or-radius-xl);
        background: var(--or-bg-badge);
        color: var(--or-text-soft);

        // Above the row's play button: shows the metrics of this degradation's category
        &--link {
            position: relative;
            z-index: 1;
            border: 1px solid transparent;

            &:hover,
            &:focus-visible {
                border-color: var(--or-border-strong);
                color: var(--or-text);
                outline: 0;
            }
        }
    }

    &__snr {
        flex: 0 0 116px;
    }

    &__length {
        flex: 0 0 60px;
    }

    &--compact {
        gap: 0;

        .sample-table__sample {
            gap: var(--or-spacing-sm-md);
            height: 60px;
            padding: 0 var(--or-spacing-xs);
            border-bottom: 1px solid var(--or-bg-surface);
            border-radius: 0;
        }

        .sample-table__marker {
            flex-basis: auto;
        }

        .sample-table__snr {
            flex-basis: 78px;
            text-align: right;
        }
    }
}
</style>
