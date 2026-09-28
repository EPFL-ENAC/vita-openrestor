<!-- frontend/src/pages/IndexPage.vue -->
<template>
    <q-page padding class="flex flex-center">
        <div class="text-center">
            <div class="text-h4">{{ t('appTitle') }}</div>
            <p class="q-mt-md">{{ t('index.comingSoon') }}</p>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
