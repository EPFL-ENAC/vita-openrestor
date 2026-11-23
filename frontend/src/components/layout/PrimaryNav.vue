<template>
    <nav
        class="primary-nav no-wrap"
        :class="[`primary-nav--${layout}`, layout === 'sidebar' ? 'column' : 'row bg-sunken']"
        :aria-label="t('nav.primary')"
    >
        <router-link
            v-for="item in items"
            :key="item.route"
            :to="{ name: item.route }"
            class="primary-nav__item no-wrap items-center"
            :class="[
                layout === 'sidebar' ? 'row' : 'col column',
                { 'primary-nav__item--active': isActive(item.routes) },
            ]"
        >
            <app-icon
                :src="layout === 'sidebar' ? item.icon : item.iconSmall"
                :size="layout === 'sidebar' ? 20 : 18"
            />
            <span
                :class="
                    layout === 'sidebar'
                        ? 'text-subtitle2 text-weight-bolder'
                        : 'text-caption text-weight-bold'
                "
            >
                {{ t(item.labelKey) }}
            </span>
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
// Typography and flex come from the global classes in the template.
// The colors stay here because the active state changes them.
.primary-nav__item {
    color: var(--or-text-muted);
    text-decoration: none;

    &--active {
        color: var(--or-text);
    }
}

.primary-nav--sidebar {
    gap: var(--or-spacing-xs);
    padding: 0 var(--or-spacing-sm-md) var(--or-spacing-sm-md);

    .primary-nav__item {
        gap: var(--or-spacing-md);
        height: 44px;
        padding: 0 var(--or-spacing-sm-md);
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
}

.primary-nav--bottom {
    height: 62px;
    border-top: 1px solid var(--or-border);

    .primary-nav__item {
        gap: var(--or-spacing-xs);
        padding-top: var(--or-spacing-sm);

        &--active::after {
            content: '';
            width: 24px;
            height: 3px;
            border-radius: var(--or-radius-xs);
            background: var(--q-primary);
        }
    }
}
</style>
