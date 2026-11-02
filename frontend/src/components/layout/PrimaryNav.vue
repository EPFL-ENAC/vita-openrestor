<template>
    <nav class="primary-nav" :class="`primary-nav--${layout}`" :aria-label="t('nav.primary')">
        <router-link
            v-for="item in items"
            :key="item.route"
            :to="{ name: item.route }"
            class="primary-nav__item"
            :class="{ 'primary-nav__item--active': isActive(item.routes) }"
        >
            <app-icon
                :src="layout === 'sidebar' ? item.icon : item.iconSmall"
                :size="layout === 'sidebar' ? 20 : 18"
            />
            <span class="primary-nav__label">{{ t(item.labelKey) }}</span>
        </router-link>
    </nav>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import AppIcon from 'components/AppIcon.vue';
import { PRIMARY_NAV_ITEMS as items } from 'src/constants/navigation';

defineProps<{
    // sidebar: vertical list (desktop); bottom: two equal tabs (mobile)
    layout: 'sidebar' | 'bottom';
}>();

const { t } = useI18n();
const route = useRoute();

function isActive(routes: readonly string[]): boolean {
    return typeof route.name === 'string' && routes.includes(route.name);
}
</script>

<style scoped lang="scss">
.primary-nav__item {
    color: var(--or-text-muted);
    text-decoration: none;

    &--active {
        color: var(--or-text);
    }
}

.primary-nav--sidebar {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 0 12px 12px;

    .primary-nav__item {
        display: flex;
        align-items: center;
        gap: 16px;
        height: 44px;
        padding: 0 12px;
        border-left: 3px solid transparent;
        border-radius: var(--or-radius-md);

        &:hover {
            background: var(--or-bg-surface);
        }

        &--active {
            background: var(--or-bg-surface);
            border-left-color: var(--q-primary);
            border-radius: var(--or-radius-lg);
        }
    }

    .primary-nav__label {
        font-size: 14px;
        font-weight: 800;
    }
}

.primary-nav--bottom {
    display: flex;
    height: 62px;
    background: var(--or-bg-sunken);
    border-top: 1px solid var(--or-border);

    .primary-nav__item {
        flex: 1 1 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding-top: 10px;

        &--active::after {
            content: '';
            width: 24px;
            height: 3px;
            border-radius: var(--or-radius-xs);
            background: var(--q-primary);
        }
    }

    .primary-nav__label {
        font-size: 10px;
        font-weight: 700;
    }
}
</style>
