<template>
    <div class="metrics-table" :class="{ 'metrics-table--compact': compact }">
        <!-- One tile per metric family, with its headline metric. A tile opens its family. -->
        <div class="metrics-table__tiles" role="tablist">
            <button
                v-for="group in METRIC_GROUPS"
                :key="group.key"
                type="button"
                role="tab"
                class="metrics-table__tile"
                :class="{ 'metrics-table__tile--selected': group.key === selectedKey }"
                :aria-selected="group.key === selectedKey"
                @click="selectedKey = group.key"
            >
                <span class="metrics-table__tile-title">
                    {{ t(`leaderboard.metricsTable.groups.${group.key}.title`) }}
                </span>
                <!-- The improvement, as on the leaderboard; the restored value below -->
                <span
                    class="metrics-table__tile-value"
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
                <span class="metrics-table__tile-detail">
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
            <p class="metrics-table__description text-muted">
                {{ t(`leaderboard.metricsTable.groups.${selected.key}.description`) }}
            </p>
            <div role="table">
                <div class="metrics-table__row metrics-table__head" role="row">
                    <span role="columnheader">{{
                        t('leaderboard.metricsTable.columns.metric')
                    }}</span>
                    <span v-if="!compact" role="columnheader" class="metrics-table__number">
                        {{ t('leaderboard.metricsTable.columns.degraded') }}
                    </span>
                    <span role="columnheader" class="metrics-table__number">
                        {{ t('leaderboard.metricsTable.columns.restored') }}
                    </span>
                    <span role="columnheader" class="metrics-table__number">
                        {{ t('leaderboard.metricsTable.columns.improvement') }}
                    </span>
                </div>
                <div
                    v-for="key in selected.metrics"
                    :key="key"
                    class="metrics-table__row metrics-table__metric"
                    role="row"
                >
                    <span class="metrics-table__name" role="cell">
                        {{ t(`leaderboard.metricsTable.metrics.${key}`) }}
                        <!-- Which way the degraded and restored values get better -->
                        <span class="metrics-table__direction text-muted">
                            <span aria-hidden="true">{{
                                summary.metrics[key].direction === 'higher' ? '↑' : '↓'
                            }}</span>
                            {{ directionLabel(key) }}
                        </span>
                    </span>
                    <span v-if="!compact" class="metrics-table__number text-muted" role="cell">
                        {{ format(key, summary.metrics[key].degraded) }}
                    </span>
                    <span class="metrics-table__number" role="cell">
                        {{ format(key, summary.metrics[key].restored) }}
                    </span>
                    <span class="metrics-table__number" :class="improvementClass(key)" role="cell">
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
.metrics-table {
    display: flex;
    flex-direction: column;
    gap: 16px;
    font-size: 14px;

    &__tiles {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 8px;
    }

    &__tile {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
        padding: 12px 14px;
        border: 1px solid transparent;
        border-radius: var(--or-radius-lg);
        background: var(--or-bg-raised);
        color: var(--or-text);
        font: inherit;
        text-align: left;
        cursor: pointer;

        &:hover {
            background: var(--or-bg-control);
        }

        &--selected {
            border-color: var(--or-border-strong);
            background: var(--or-bg-control);
        }
    }

    &__tile-title {
        color: var(--or-text-muted);
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
    }

    &__tile-value {
        font-size: 20px;
        font-weight: 800;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
    }

    &__tile-detail {
        overflow: hidden;
        color: var(--or-text-muted);
        font-size: 12px;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &__description {
        margin: 0 0 4px;
        font-size: 13px;
    }

    &__row {
        display: grid;
        grid-template-columns: minmax(160px, 1.6fr) repeat(3, minmax(90px, 1fr));
        gap: 16px;
        align-items: center;
        padding: 0 16px;
    }

    &__head {
        height: 30px;
        border-bottom: 1px solid var(--or-border);
        color: var(--or-text-muted);
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
    }

    &__metric {
        min-height: 40px;
        border-bottom: 1px solid var(--or-border);
    }

    &__name {
        display: flex;
        flex-direction: column;
        gap: 1px;
        min-width: 0;
        padding: 6px 0;
        font-weight: 700;
    }

    &__direction {
        font-size: 12px;
        font-weight: 400;
    }

    &__number {
        font-variant-numeric: tabular-nums;
        text-align: right;
        white-space: nowrap;
    }

    &--compact {
        font-size: 13px;

        .metrics-table__tiles {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .metrics-table__row {
            grid-template-columns: minmax(0, 1fr) auto auto;
            gap: 12px;
            padding: 0;
        }
    }
}
</style>
