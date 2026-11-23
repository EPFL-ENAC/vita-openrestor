<template>
    <div class="mobile-header bg-page">
        <div class="release-accent" />
        <div class="mobile-header__bar row no-wrap items-center justify-between q-px-md">
            <app-brand compact />
            <div class="mobile-header__actions row no-wrap items-center">
                <button
                    type="button"
                    class="plain-button flex text-muted"
                    :aria-label="t('header.search')"
                >
                    <app-icon :src="searchIcon" :size="20" />
                </button>
                <router-link
                    :to="{ name: 'submission-new' }"
                    class="flex text-muted"
                    :aria-label="t('library.submitModel')"
                >
                    <app-icon :src="plusIcon" :size="20" />
                </router-link>
                <account-menu />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AppIcon from 'components/AppIcon.vue';
import AppBrand from './AppBrand.vue';
import AccountMenu from './AccountMenu.vue';
import searchIcon from 'assets/icons/search-20.svg';
import plusIcon from 'assets/icons/plus-20.svg';

const { t } = useI18n();
</script>

<style scoped lang="scss">
// Flex, spacing and colors come from the global classes in the template
.mobile-header {
    border-bottom: 1px solid var(--or-border);

    &__bar {
        height: 52px;
    }

    &__actions {
        gap: var(--or-spacing-xl);
    }
}
</style>
