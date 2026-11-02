<template>
    <div class="version-selector" role="radiogroup" :aria-label="t('player.version')">
        <button
            v-for="option in versions"
            :key="option"
            type="button"
            role="radio"
            class="version-selector__option"
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
    display: flex;
    align-items: center;
    height: 44px;
    padding: 2px;
    border-radius: var(--or-radius-pill);
    background: var(--or-bg-control);

    &__option {
        height: 40px;
        padding: 0 14px;
        border: 0;
        border-radius: var(--or-radius-pill);
        background: transparent;
        color: var(--or-text-muted);
        font: inherit;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;

        &--selected {
            background: var(--q-accent);
            color: var(--or-text-on-accent);
        }
    }
}
</style>
