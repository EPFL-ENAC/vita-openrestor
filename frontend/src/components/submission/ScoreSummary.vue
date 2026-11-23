<template>
    <div
        class="score-summary no-wrap q-pa-md rounded-lg bg-raised"
        :class="
            compact ? 'score-summary--compact row items-start justify-between' : 'column reverse'
        "
    >
        <div class="score-summary__scores row no-wrap">
            <div class="score-summary__metric column no-wrap text-no-wrap">
                <strong class="text-h5">{{ snrGain === null ? '—' : formatSnr(snrGain) }}</strong>
                <span class="text-caption text-muted">{{ t('leaderboard.metrics.snrGain') }}</span>
            </div>
            <div class="score-summary__metric column no-wrap text-no-wrap">
                <strong class="text-h5">{{
                    listening === null ? t('submission.scores.pending') : formatListening(listening)
                }}</strong>
                <span class="text-caption text-muted">{{ t('submission.scores.listening') }}</span>
            </div>
        </div>
        <sample-data-badge :class="{ 'self-end': !compact }" />
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
// Typography, flex and the card look come from the global classes in the template
// (desktop: `column reverse` puts the badge above the scores). Only the gaps stay here.
.score-summary {
    gap: var(--or-spacing-sm-md);

    &__scores {
        gap: var(--or-spacing-lg);
    }

    &__metric {
        gap: var(--or-spacing-xxs);
    }

    &--compact {
        gap: var(--or-spacing-lg);
    }
}
</style>
