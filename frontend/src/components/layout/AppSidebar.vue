<template>
    <div class="app-sidebar">
        <div class="app-sidebar__brand">
            <app-brand />
            <account-menu />
        </div>

        <primary-nav layout="sidebar" />

        <q-separator />

        <div class="app-sidebar__library">
            <my-submissions v-if="submissions.list" :submissions="submissions.list" />
        </div>

        <div class="app-sidebar__footer">
            <q-btn
                unelevated
                no-caps
                color="primary"
                text-color="black"
                padding="8px 10px"
                class="app-sidebar__submit"
                :to="{ name: 'submission-new' }"
                icon="sym_o_deployed_code"
                :label="t('library.submitModel')"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
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
.app-sidebar {
    display: flex;
    flex-direction: column;
    min-height: 100%;

    // Logo, with the account menu (language, sign out) at the right
    &__brand {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 60px;
        padding: 12px 16px 0 24px;
        margin-bottom: 8px;
    }

    &__library {
        display: flex;
        flex-direction: column;
        gap: 24px;
        padding: 27px 20px 24px;
    }

    &__submit {
        flex: 1 1 auto;
        font-size: 12px;
        font-weight: 700;

        :deep(.q-icon) {
            margin-right: 6px;
            font-size: 18px;
        }
    }

    &__footer {
        display: flex;
        margin-top: auto;
        padding: 12px 20px;
    }
}
</style>
