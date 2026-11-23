<template>
    <router-link
        to="/"
        class="app-brand row inline no-wrap items-center"
        :class="{ 'app-brand--compact': compact }"
    >
        <!-- Signal bars of the brand mark, heights relative to the mark size -->
        <span
            class="app-brand__mark row no-wrap items-center justify-center bg-primary"
            aria-hidden="true"
        >
            <span class="app-brand__bar" style="height: 21%" />
            <span class="app-brand__bar" style="height: 45%" />
            <span class="app-brand__bar" style="height: 61%" />
            <span class="app-brand__bar" style="height: 30%" />
            <span class="app-brand__bar" style="height: 15%" />
        </span>
        <!-- text-h3 is already smaller on phones -->
        <span class="text-h3 text-no-wrap">{{ t('appTitle') }}</span>
    </router-link>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineProps<{
    // Mobile header variant: smaller mark
    compact?: boolean;
}>();

const { t } = useI18n();
</script>

<style scoped lang="scss">
// Typography, flex and the mark color come from the global classes in the template
.app-brand {
    gap: var(--or-spacing-sm);
    color: var(--or-text);
    text-decoration: none;

    &__mark {
        gap: var(--or-spacing-xxs);
        width: 28px;
        height: 28px;
        border-radius: var(--or-radius-pill);
    }

    &__bar {
        width: 1.5px;
        background: var(--or-text-on-accent);
    }

    &--compact .app-brand__mark {
        width: 26px;
        height: 26px;
    }
}
</style>
