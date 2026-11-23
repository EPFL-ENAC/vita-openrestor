<template>
    <div
        class="version-selector row no-wrap items-center q-pa-xxs rounded-pill bg-control"
        role="radiogroup"
        :aria-label="t('player.version')"
    >
        <button
            v-for="option in versions"
            :key="option"
            type="button"
            role="radio"
            class="version-selector__option plain-button rounded-pill text-caption text-weight-bolder"
            :class="{ 'version-selector__option--selected': option === modelValue }"
            :aria-checked="option === modelValue"
            @click="emit('update:modelValue', option)"
        >
            {{ t(`player.versions.${option}`) }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { AudioVersion } from 'src/stores/player';

defineProps<{
    modelValue: AudioVersion;
    versions: readonly AudioVersion[];
}>();

const emit = defineEmits<{ 'update:modelValue': [version: AudioVersion] }>();

const { t } = useI18n();
</script>

<style scoped lang="scss">
.version-selector {
    height: 44px;

    &__option {
        height: 40px;
        padding: 0 var(--or-spacing-sm-md);
        color: var(--or-text-muted);

        &--selected {
            background: var(--q-accent);
            color: var(--or-text-on-accent);
        }
    }
}
</style>
