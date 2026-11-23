<template>
    <div
        class="metrics-table column no-wrap text-body1"
        :class="{ 'metrics-table--compact': compact }"
    >
        <!-- One tile per metric family, with its headline metric. A tile opens its family. -->
        <div class="metrics-table__tiles" role="tablist">
            <button
                v-for="group in METRIC_GROUPS"
                :key="group.key"
                type="button"
                role="tab"
                class="metrics-table__tile plain-button column no-wrap q-pa-sm-md text-left"
                :class="{ 'metrics-table__tile--selected': group.key === selectedKey }"
                :aria-selected="group.key === selectedKey"
                @click="selectedKey = group.key"
            >
                <span class="text-overline text-muted">
                    {{ t(`leaderboard.metricsTable.groups.${group.key}.title`) }}
                </span>
                <!-- The improvement, as on the leaderboard; the restored value below -->
                <span
                    class="metrics-table__tile-value text-h4 text-no-wrap"
                    :class="{
                        'text-negative': summary.metrics[HEADLINE[group.key]].improvement < 0,
                    }"
                >
                    {{
                        format(
                            HEADLINE[group.key],
                            summary.metrics[HEADLINE[group.key]].improvement,
                            true,
                        )
                    }}
                </span>
                <span class="text-caption text-muted ellipsis">
                    {{
                        t('leaderboard.metricsTable.tileDetail', {
                            metric: HEADLINE_SHORT[group.key],
                            value: format(
                                HEADLINE[group.key],
                                summary.metrics[HEADLINE[group.key]].restored,
                            ),
                        })
                    }}
                </span>
            </button>
        </div>

        <!-- Every metric of the selected family -->
        <div class="metrics-table__detail" role="tabpanel">
            <p class="text-body2 text-muted q-mt-none q-mb-xs">
                {{ t(`leaderboard.metricsTable.groups.${selected.key}.description`) }}
            </p>
            <div role="table">
                <div
                    class="metrics-table__row metrics-table__head text-overline text-muted"
                    role="row"
                >
                    <span role="columnheader">{{
                        t('leaderboard.metricsTable.columns.metric')
                    }}</span>
                    <span
                        v-if="!compact"
                        role="columnheader"
                        class="metrics-table__number text-right text-no-wrap"
                    >
                        {{ t('leaderboard.metricsTable.columns.degraded') }}
                    </span>
                    <span role="columnheader" class="metrics-table__number text-right text-no-wrap">
                        {{ t('leaderboard.metricsTable.columns.restored') }}
                    </span>
                    <span role="columnheader" class="metrics-table__number text-right text-no-wrap">
                        {{ t('leaderboard.metricsTable.columns.improvement') }}
                    </span>
                </div>
                <div
                    v-for="key in selected.metrics"
                    :key="key"
                    class="metrics-table__row metrics-table__metric"
                    role="row"
                >
                    <span
                        class="metrics-table__name column no-wrap q-py-xs text-weight-bold"
                        role="cell"
                    >
                        {{ t(`leaderboard.metricsTable.metrics.${key}`) }}
                        <!-- Which way the degraded and restored values get better -->
                        <span class="text-caption text-muted">
                            <span aria-hidden="true">{{
                                summary.metrics[key].direction === 'higher' ? '↑' : '↓'
                            }}</span>
                            {{ directionLabel(key) }}
                        </span>
                    </span>
                    <span
                        v-if="!compact"
                        class="metrics-table__number text-right text-no-wrap text-muted"
                        role="cell"
                    >
                        {{ format(key, summary.metrics[key].degraded) }}
                    </span>
                    <span class="metrics-table__number text-right text-no-wrap" role="cell">
                        {{ format(key, summary.metrics[key].restored) }}
                    </span>
                    <span
                        class="metrics-table__number text-right text-no-wrap"
                        :class="improvementClass(key)"
                        role="cell"
                    >
                        {{ format(key, summary.metrics[key].improvement, true) }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
    METRIC_GROUPS,
    type MetricGroupKey,
    type MetricKey,
    type MetricSummary,
} from 'src/types/metrics';
import { METRIC_DISPLAY } from 'src/constants/metrics';

// One model's metrics on the test split (organisation of openrestor/metrics). A row of tiles
// gives each metric family's headline metric (its improvement, then its restored value); the selected family is listed below, each
// metric with the degraded input, the restoration and the improvement (positive = closer
// to the original). Under each name: whether higher or lower values are better. Mobile drops the degraded column.
const props = defineProps<{
    summary: MetricSummary;
    compact?: boolean;
}>();

const { t, locale } = useI18n();

// The metric a family's tile shows
const HEADLINE: Record<MetricGroupKey, MetricKey> = {
    waveform: 'snr_db',
    spectral: 'lsd_db',
    reverb: 'drr_db',
    degradationAware: 'aae',
    perceptual: 'clap_cosine',
};

// Short name of the headline metric, so the tile also fits its improvement
const HEADLINE_SHORT: Record<MetricGroupKey, string> = {
    waveform: 'SNR',
    spectral: 'LSD',
    reverb: 'DRR',
    degradationAware: 'AAE',
    perceptual: 'CLAP',
};

const selectedKey = ref<MetricGroupKey>('waveform');
const selected = computed(
    () => METRIC_GROUPS.find((g) => g.key === selectedKey.value) ?? METRIC_GROUPS[0],
);

function improvementClass(key: MetricKey): string {
    return props.summary.metrics[key].improvement >= 0 ? 'text-positive' : 'text-negative';
}

function directionLabel(key: MetricKey): string {
    return t(`leaderboard.metricsTable.direction.${props.summary.metrics[key].direction}`);
}

function format(key: MetricKey, value: number, signed = false): string {
    const { unit, decimals } = METRIC_DISPLAY[key];
    const number = new Intl.NumberFormat(locale.value, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        signDisplay: signed ? 'exceptZero' : 'auto',
    }).format(value);
    return unit ? `${number} ${unit}` : number;
}
</script>

<style scoped lang="scss">
// Typography and flex come from the global classes in the template.
// Only the grids, the tile states and the row sizes stay here.
.metrics-table {
    gap: var(--or-spacing-md);

    &__tiles {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: var(--or-spacing-sm);
    }

    // Background and color stay here: the hover and selected states change them
    &__tile {
        gap: var(--or-spacing-xs);
        min-width: 0;
        border: 1px solid transparent;
        border-radius: var(--or-radius-lg);
        background: var(--or-bg-raised);
        color: var(--or-text);

        &:hover {
            background: var(--or-bg-control);
        }

        &--selected {
            border-color: var(--or-border-strong);
            background: var(--or-bg-control);
        }
    }

    &__tile-value {
        font-variant-numeric: tabular-nums;
    }

    &__row {
        display: grid;
        grid-template-columns: minmax(160px, 1.6fr) repeat(3, minmax(90px, 1fr));
        gap: var(--or-spacing-md);
        align-items: center;
        padding: 0 var(--or-spacing-md);
    }

    &__head {
        height: 30px;
        border-bottom: 1px solid var(--or-border);
    }

    &__metric {
        min-height: 40px;
        border-bottom: 1px solid var(--or-border);
    }

    &__name {
        gap: var(--or-spacing-xxs);
        min-width: 0;
    }

    &__number {
        font-variant-numeric: tabular-nums;
    }

    &--compact {
        .metrics-table__tiles {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .metrics-table__row {
            grid-template-columns: minmax(0, 1fr) auto auto;
            gap: var(--or-spacing-sm-md);
            padding: 0;
        }
    }
}
</style>
