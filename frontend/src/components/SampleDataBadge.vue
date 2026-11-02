<template>
    <span class="sample-data-badge">{{ t('leaderboard.sampleData') }}</span>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

// Says the figures on the page are mock data (atom/Badge, Kind=Sample data)
const { t } = useI18n();
</script>

<style scoped lang="scss">
.sample-data-badge {
    display: inline-flex;
    align-items: center;
    height: 22px;
    padding: 0 10px;
    border: 1px solid var(--q-warning);
    border-radius: var(--or-radius-pill);
    color: var(--q-warning);
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
}
</style>
