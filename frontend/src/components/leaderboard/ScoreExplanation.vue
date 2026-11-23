<template>
    <section class="score-explanation column no-wrap q-pa-md bg-raised text-body2">
        <h2 class="text-subtitle2 text-weight-bolder q-my-none">
            {{ t('leaderboard.scores.title') }}
        </h2>
        <div
            v-for="metric in METRICS"
            :key="metric"
            class="score-explanation__definition column no-wrap"
        >
            <span class="text-weight-bold">{{ t(`leaderboard.scores.${metric}.term`) }}</span>
            <p class="text-muted q-my-none">{{ t(`leaderboard.scores.${metric}.definition`) }}</p>
        </div>
        <p class="text-muted q-my-none">{{ t('leaderboard.scores.note') }}</p>
    </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

// Metric definitions beside the ranking (molecule/Guidance/Score explanation)
const METRICS = ['snrGain', 'listening'] as const;

const { t } = useI18n();
</script>

<style scoped lang="scss">
// Typography, colors and flex come from the global classes in the template
.score-explanation {
    gap: var(--or-spacing-sm-md);
    border-radius: var(--or-radius-lg);

    &__definition {
        gap: var(--or-spacing-xxs);
    }
}
</style>
