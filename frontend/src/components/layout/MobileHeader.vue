<template>
    <div class="mobile-header">
        <div class="release-accent" />
        <div class="mobile-header__bar">
            <app-brand compact />
            <div class="mobile-header__actions">
                <button
                    type="button"
                    class="mobile-header__action"
                    :aria-label="t('header.search')"
                >
                    <app-icon :src="searchIcon" :size="20" />
                </button>
                <router-link
                    :to="{ name: 'submission-new' }"
                    class="mobile-header__action"
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
.mobile-header {
    background: var(--or-bg-page);
    border-bottom: 1px solid var(--or-border);

    &__bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 52px;
        padding: 0 16px;
    }

    &__actions {
        display: flex;
        align-items: center;
        gap: 32px;
    }

    &__action {
        display: flex;
        padding: 0;
        border: 0;
        background: none;
        color: var(--or-text-muted);
        cursor: pointer;
    }
}
</style>
