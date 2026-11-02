<template>
    <div class="score-summary" :class="{ 'score-summary--compact': compact }">
        <div class="score-summary__scores">
            <div class="score-summary__metric">
                <strong>{{ snrGain === null ? '—' : formatSnr(snrGain) }}</strong>
                <span>{{ t('leaderboard.metrics.snrGain') }}</span>
            </div>
            <div class="score-summary__metric">
                <strong>{{
                    listening === null ? t('submission.scores.pending') : formatListening(listening)
                }}</strong>
                <span>{{ t('submission.scores.listening') }}</span>
            </div>
        </div>
        <sample-data-badge class="score-summary__badge" />
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import SampleDataBadge from 'components/SampleDataBadge.vue';
import { formatListening, formatSnr } from 'components/leaderboard/format';

// Scores once the checks passed (molecule/Submission/Score summary). The listening test
// stays pending until the owner review completes.
defineProps<{
    snrGain: number | null;
    listening: number | null;
    // Mobile: scores and badge on one row
    compact?: boolean;
}>();

const { t } = useI18n();
</script>

<style scoped lang="scss">
.score-summary {
    display: flex;
    flex-direction: column-reverse;
    gap: 12px;
    padding: 18px 16px;
    border-radius: var(--or-radius-lg);
    background: var(--or-bg-raised);

    &__badge {
        align-self: flex-end;
    }

    &__scores {
        display: flex;
        gap: 24px;
    }

    &__metric {
        display: flex;
        flex-direction: column;
        gap: 2px;
        line-height: 1.25;
        white-space: nowrap;

        strong {
            font-size: 18px;
            font-weight: 800;
        }

        span {
            color: var(--or-text-muted);
            font-size: 12px;
        }
    }

    &--compact {
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        gap: 24px;

        .score-summary__badge {
            align-self: flex-start;
        }
    }
}
</style>
