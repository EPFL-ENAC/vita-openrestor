<template>
    <section class="score-explanation">
        <h2 class="score-explanation__title">{{ t('leaderboard.scores.title') }}</h2>
        <div v-for="metric in METRICS" :key="metric" class="score-explanation__definition">
            <span class="score-explanation__term">{{
                t(`leaderboard.scores.${metric}.term`)
            }}</span>
            <p>{{ t(`leaderboard.scores.${metric}.definition`) }}</p>
        </div>
        <p>{{ t('leaderboard.scores.note') }}</p>
    </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

// Metric definitions beside the ranking (molecule/Guidance/Score explanation)
const METRICS = ['snrGain', 'listening'] as const;

const { t } = useI18n();
</script>

<style scoped lang="scss">
.score-explanation {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 16px;
    border-radius: var(--or-radius-lg);
    background: var(--or-bg-raised);
    font-size: 13px;

    p {
        margin: 0;
        color: var(--or-text-muted);
        line-height: 1.4;
    }

    &__title {
        margin: 0;
        font-family: inherit;
        font-size: 14px;
        font-weight: 800;
        line-height: 1.25;
    }

    &__definition {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    &__term {
        font-weight: 700;
        line-height: 1.25;
    }
}
</style>
