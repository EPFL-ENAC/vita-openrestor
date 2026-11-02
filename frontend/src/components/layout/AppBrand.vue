<template>
    <router-link to="/" class="app-brand" :class="{ 'app-brand--compact': compact }">
        <span class="app-brand__mark" aria-hidden="true">
            <span v-for="(height, index) in BAR_HEIGHTS" :key="index" :style="{ height }" />
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

// Signal bars of the brand mark, relative to the mark size
const BAR_HEIGHTS = ['21%', '45%', '61%', '30%', '15%'];

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

        span {
            width: 1.5px;
            background: var(--or-text-on-accent);
        }
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
