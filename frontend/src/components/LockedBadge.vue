<template>
    <span class="locked-badge">{{ t('submission.locked') }}</span>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

// Says a value can no longer be edited (atom/Badge, Kind=Locked)
const { t } = useI18n();
</script>

<style scoped lang="scss">
.locked-badge {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    height: 22px;
    padding: 0 10px;
    border: 1px solid var(--or-border-locked);
    border-radius: var(--or-radius-pill);
    background: var(--or-bg-control);
    color: var(--or-text-soft);
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
}
</style>
