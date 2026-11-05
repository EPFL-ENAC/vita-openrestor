<template>
    <div class="sample-table" :class="{ 'sample-table--compact': compact }">
        <div v-if="!compact" class="sample-table__row sample-table__head">
            <span class="sample-table__index">#</span>
            <span class="sample-table__marker" />
            <span class="sample-table__identity">{{
                t('leaderboard.samples.columns.sample')
            }}</span>
            <span class="sample-table__degradation">
                {{ t('leaderboard.samples.columns.degradation') }}
            </span>
            <span class="sample-table__snr">{{ t('leaderboard.columns.snrGain') }}</span>
            <span class="sample-table__length">{{ t('leaderboard.samples.columns.length') }}</span>
        </div>

        <div class="sample-table__rows">
            <div
                v-for="(sample, index) in samples"
                :key="sample.id"
                class="sample-table__row sample-table__sample"
                :class="{
                    'sample-table__sample--selected': sample.id === selectedId,
                    'sample-table__sample--playing': sample.id === playingId,
                }"
            >
                <!-- Covers the whole row: clicking anywhere plays the sample, except on the
                     degradation tag, which sits above it -->
                <button
                    type="button"
                    class="sample-table__hit"
                    :aria-pressed="sample.id === selectedId"
                    :aria-label="
                        sample.id === playingId
                            ? t('leaderboard.samples.pause', { sample: sample.id })
                            : t('leaderboard.samples.play', { sample: sample.id })
                    "
                    @click="emit('select', sample)"
                />
                <!-- Number, replaced by play / pause while the row is hovered -->
                <span v-if="!compact" class="sample-table__index">
                    <span class="sample-table__number">{{ index + 1 }}</span>
                    <q-icon
                        class="sample-table__toggle"
                        :name="sample.id === playingId ? 'pause' : 'play_arrow'"
                        size="20px"
                    />
                </span>
                <span class="sample-table__marker">
                    <sound-thumb :size="36" :active="sample.id === selectedId" />
                </span>
                <span class="sample-table__identity">
                    <span class="sample-table__name">{{ sample.id }}</span>
                    <span class="sample-table__detail text-muted">
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
                        class="sample-table__badge sample-table__badge--link"
                        :title="
                            t('leaderboard.samples.showCategory', {
                                category: categoryOf(sample.degradation),
                            })
                        "
                        @click="emit('category', categoryOf(sample.degradation) ?? '')"
                    >
                        {{ sample.degradation }}
                    </button>
                    <span v-else class="sample-table__badge">{{ sample.degradation }}</span>
                </span>
                <span class="sample-table__snr">{{ formatSnr(snr[sample.id] ?? 0) }}</span>
                <span v-if="!compact" class="sample-table__length text-muted">
                    {{ formatDuration(sample.durationSeconds) }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
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

const { t } = useI18n();
</script>

<style scoped lang="scss">
.sample-table {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &__row {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 0 16px;
    }

    &__head {
        height: 30px;
        align-items: flex-start;
        margin-top: 6px;
        border-bottom: 1px solid var(--or-border);
        color: var(--or-text-muted);
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
    }

    &__rows {
        display: flex;
        flex-direction: column;
    }

    &__sample {
        position: relative;
        height: 56px;
        border-radius: var(--or-radius-md);
        color: var(--or-text);
        cursor: pointer;

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
        position: absolute;
        inset: 0;
        padding: 0;
        border: 0;
        border-radius: inherit;
        outline: 0;
        background: transparent;
        cursor: pointer;
    }

    &__index {
        display: flex;
        flex: 0 0 44px;
        align-items: center;
        color: var(--or-text-muted);
        font-size: 16px;
    }

    // Same left edge as the numbers below
    &__head &__index {
        font-size: 12px;
    }

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
        display: flex;
        flex: 0 0 48px;
    }

    &__identity {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
        line-height: 1.25;
    }

    &__name {
        overflow: hidden;
        font-size: 14px;
        font-weight: 700;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &__detail {
        font-size: 13px;
    }

    &__degradation {
        flex: 0 0 156px;
    }

    &__badge {
        padding: 3px 8px;
        border-radius: var(--or-radius-xl);
        background: var(--or-bg-badge);
        color: var(--or-text-soft);
        font-size: 12px;
        font-weight: 700;

        // Above the row's play button: shows the metrics of this degradation's category
        &--link {
            position: relative;
            z-index: 1;
            border: 1px solid transparent;
            font-family: inherit;
            cursor: pointer;

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
        font-size: 14px;
        font-weight: 600;
    }

    &__length {
        flex: 0 0 60px;
        font-size: 14px;
    }

    &__head &__snr,
    &__head &__length {
        color: inherit;
        font-size: 12px;
    }

    &--compact {
        gap: 0;

        .sample-table__sample {
            gap: 12px;
            height: 60px;
            padding: 0 4px;
            border-bottom: 1px solid var(--or-bg-surface);
            border-radius: 0;
        }

        .sample-table__marker {
            flex-basis: auto;
        }

        .sample-table__detail {
            font-size: 12px;
        }

        .sample-table__snr {
            flex-basis: 78px;
            text-align: right;
        }
    }
}
</style>
