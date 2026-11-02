<template>
    <label class="search-field" :class="{ 'search-field--block': block }">
        <app-icon :src="searchIcon" :size="16" class="text-muted" />
        <input
            :value="modelValue"
            type="search"
            class="search-field__input"
            :placeholder="placeholder"
            :aria-label="placeholder"
            @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        />
    </label>
</template>

<script setup lang="ts">
import AppIcon from 'components/AppIcon.vue';
import searchIcon from 'assets/icons/search-20.svg';

// Pill search input (molecule/Datasets/Search). Compact on desktop, widens on focus.
defineProps<{
    modelValue: string;
    placeholder: string;
    // Full width, taller (mobile)
    block?: boolean;
}>();

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<style scoped lang="scss">
.search-field {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: 8px;
    width: 96px;
    height: 40px;
    padding: 0 12px;
    border-radius: var(--or-radius-pill);
    background: var(--or-bg-control);
    transition: width 0.15s;
    cursor: text;

    &:focus-within {
        width: 200px;
    }

    &__input {
        width: 100%;
        min-width: 0;
        padding: 0;
        border: 0;
        outline: 0;
        background: transparent;
        color: var(--or-text);
        font-family: 'Roboto', sans-serif;
        font-size: 14px;

        &::placeholder {
            color: var(--or-text-placeholder);
        }
    }

    &--block {
        width: 100%;
        height: 44px;

        &:focus-within {
            width: 100%;
        }
    }
}
</style>
