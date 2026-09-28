<template>
    <q-layout>
        <q-header>
            <q-toolbar class="q-px-md">
                <q-img
                    src="/epfl.svg"
                    alt="EPFL logo"
                    class="logo q-mr-sm"
                    no-spinner
                    style="width: 96px"
                />
                <q-toolbar-title> {{ t('appTitle') }} </q-toolbar-title>
                <q-btn-dropdown
                    flat
                    dense
                    no-caps
                    icon="language"
                    :label="locale === 'fr' ? 'FR' : 'EN'"
                    :aria-label="t('language.label')"
                >
                    <q-list>
                        <q-item
                            v-for="option in localeOptions"
                            :key="option.value"
                            v-close-popup
                            clickable
                            @click="selectLocale(option.value)"
                        >
                            <q-item-section>{{ t(option.labelKey) }}</q-item-section>
                        </q-item>
                    </q-list>
                </q-btn-dropdown>
                <q-btn flat round icon="logout" @click="logout">
                    <q-tooltip>{{ t('auth.logout') }}</q-tooltip>
                </q-btn>
            </q-toolbar>
        </q-header>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from 'src/stores/auth';

type AppLocale = 'en-US' | 'fr';

const localeOptions: { value: AppLocale; labelKey: string }[] = [
    { value: 'en-US', labelKey: 'language.english' },
    { value: 'fr', labelKey: 'language.french' },
];

const { locale, t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();

function selectLocale(nextLocale: AppLocale): void {
    locale.value = nextLocale;
    localStorage.setItem('app-locale', nextLocale);
}

async function logout() {
    await authStore.logout();
    await router.push('/signin');
}
</script>
