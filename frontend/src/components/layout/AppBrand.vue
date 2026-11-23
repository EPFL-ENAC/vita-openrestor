<template>
    <router-link to="/" class="app-brand" :class="{ 'app-brand--compact': compact }">
        <!-- Signal bars of the brand mark, heights relative to the mark size -->
        <span class="app-brand__mark" aria-hidden="true">
            <span class="app-brand__bar" style="height: 21%" />
            <span class="app-brand__bar" style="height: 45%" />
            <span class="app-brand__bar" style="height: 61%" />
            <span class="app-brand__bar" style="height: 30%" />
            <span class="app-brand__bar" style="height: 15%" />
        </span>
        <span class="app-brand__wordmark text-h3">{{ t('appTitle') }}</span>
    </router-link>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineProps<{
    // Mobile header variant: smaller mark and wordmark
    compact?: boolean;
}>();

const { t } = useI18n();
</script>

<style scoped lang="scss">
.app-brand {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    color: var(--or-text);
    text-decoration: none;

    &__mark {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2px;
        width: 28px;
        height: 28px;
        border-radius: var(--or-radius-pill);
        background: var(--q-primary);
    }

    &__bar {
        width: 1.5px;
        background: var(--or-text-on-accent);
    }

    &__wordmark {
        white-space: nowrap;
    }

    &--compact {
        gap: 8px;

        .app-brand__mark {
            width: 26px;
            height: 26px;
        }

        .app-brand__wordmark {
            font-size: 1.1875rem; // 19px
        }
    }
}
</style>
