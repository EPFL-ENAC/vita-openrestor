<template>
    <div class="app-sidebar column no-wrap">
        <div class="app-sidebar__brand row no-wrap items-center justify-between q-mb-sm">
            <app-brand />
            <account-menu />
        </div>

        <primary-nav layout="sidebar" />

        <q-separator />

        <div class="app-sidebar__library">
            <my-submissions v-if="submissions.list" :submissions="submissions.list" />
        </div>

        <div class="app-sidebar__footer row no-wrap q-mt-auto">
            <q-btn
                unelevated
                no-caps
                color="primary"
                text-color="black"
                padding="8px 10px"
                class="app-sidebar__submit col text-caption text-weight-bold"
                :to="{ name: 'submission-new' }"
                :icon="symOutlinedDeployedCode"
                :label="t('library.submitModel')"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { symOutlinedDeployedCode } from '@quasar/extras/material-symbols-outlined';
import { useI18n } from 'vue-i18n';
import { useSubmissionsStore } from 'src/stores/submissions';
import AppBrand from './AppBrand.vue';
import PrimaryNav from './PrimaryNav.vue';
import MySubmissions from './MySubmissions.vue';
import AccountMenu from './AccountMenu.vue';

// Desktop sidebar: logo and account menu, navigation, the researcher's own submissions
// (one per model), then the submit button at the bottom. Datasets are reached through the
// Datasets page, not listed here.
const { t } = useI18n();
const submissions = useSubmissionsStore();

onMounted(async () => {
    if (!submissions.list) {
        await submissions.load();
    }
});
</script>

<style scoped lang="scss">
// Typography and flex come from the global classes in the template
.app-sidebar {
    min-height: 100%;

    // Logo, with the account menu (language, sign out) at the right
    &__brand {
        height: 60px;
        padding: var(--or-spacing-sm-md) var(--or-spacing-md) 0 var(--or-spacing-lg);
    }

    &__library {
        padding: var(--or-spacing-lg) var(--or-spacing-md-lg);
    }

    &__submit :deep(.q-icon) {
        margin-right: var(--or-spacing-xs);
        font-size: 18px;
    }

    // q-mt-auto keeps the submit button at the bottom of the sidebar
    &__footer {
        padding: var(--or-spacing-sm-md) var(--or-spacing-md-lg);
    }
}
</style>
