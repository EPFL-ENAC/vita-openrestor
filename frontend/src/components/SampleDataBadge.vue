<template>
    <span
        class="sample-data-badge row inline no-wrap items-center q-px-sm text-caption text-weight-bold text-warning text-no-wrap"
        >{{ t('leaderboard.sampleData') }}</span
    >
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

// Says the figures on the page are mock data (atom/Badge, Kind=Sample data)
const { t } = useI18n();
</script>

<style scoped lang="scss">
// Typography, color and flex come from the global classes in the template
.sample-data-badge {
    height: 22px;
    border: 1px solid var(--q-warning);
    border-radius: var(--or-radius-pill);
}
</style>
