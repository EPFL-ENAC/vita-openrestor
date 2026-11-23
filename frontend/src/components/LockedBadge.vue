<template>
    <span
        class="locked-badge row inline no-wrap items-center q-px-sm bg-control text-soft text-caption text-weight-bold text-no-wrap"
        >{{ t('submission.locked') }}</span
    >
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

// Says a value can no longer be edited (atom/Badge, Kind=Locked)
const { t } = useI18n();
</script>

<style scoped lang="scss">
// Typography, colors and flex come from the global classes in the template
.locked-badge {
    flex-shrink: 0;
    height: 22px;
    border: 1px solid var(--or-border-locked);
    border-radius: var(--or-radius-pill);
}
</style>
