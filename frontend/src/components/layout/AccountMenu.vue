<template>
    <q-btn flat round dense icon="more_horiz" class="text-muted" :aria-label="t('account.menu')">
        <q-menu anchor="bottom right" self="top right" class="bg-surface">
            <q-list dense style="min-width: 160px">
                <q-item-label header>{{ t('language.label') }}</q-item-label>
                <q-item
                    v-for="option in localeOptions"
                    :key="option.value"
                    v-close-popup
                    clickable
                    :active="locale === option.value"
                    @click="selectLocale(option.value)"
                >
                    <q-item-section>{{ t(option.labelKey) }}</q-item-section>
                </q-item>
                <q-separator />
                <q-item v-close-popup clickable @click="logout">
                    <q-item-section>{{ t('auth.logout') }}</q-item-section>
                </q-item>
            </q-list>
        </q-menu>
    </q-btn>
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
