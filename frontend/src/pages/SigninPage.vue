<template>
    <div class="signin-page row no-wrap items-center justify-center q-pa-lg">
        <section class="signin-panel text-center">
            <h1 class="signin-panel__title q-mt-none q-mb-sm">{{ t('auth.signinTitle') }}</h1>
            <p class="text-muted q-mb-lg">{{ t('auth.signinSubtitle') }}</p>
            <q-btn
                color="primary"
                :icon="matLogin"
                :label="t('auth.signin')"
                :loading="loading"
                @click="signin"
            />
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { matLogin } from '@quasar/extras/material-icons';
import { useAuthStore } from 'src/stores/auth';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const authStore = useAuthStore();
const loading = ref(false);

async function signin() {
    loading.value = true;
    try {
        const requestedRoute = Array.isArray(route.query.redirect)
            ? route.query.redirect[0]
            : route.query.redirect;
        const safeRequestedRoute =
            requestedRoute?.startsWith('/') && !requestedRoute.startsWith('//')
                ? requestedRoute
                : '/';
        const redirectPath = router.resolve(safeRequestedRoute).href;

        await authStore.login(new URL(redirectPath, window.location.origin).href);
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped lang="scss">
// Flex, spacing and colors come from the global classes in the template
.signin-page {
    min-height: 100vh;
}

.signin-panel {
    max-width: 420px;

    // 32px ($font-size-32) on every screen: no text class has this size on desktop
    &__title {
        font-size: 2rem;
    }
}
</style>
