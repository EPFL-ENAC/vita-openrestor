<template>
    <label
        class="search-field row no-wrap items-center q-px-sm-md bg-control"
        :class="{ 'search-field--block': block }"
    >
        <app-icon :src="searchIcon" :size="16" class="text-muted" />
        <input
            :value="modelValue"
            type="search"
            class="search-field__input col text-body1"
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
// Typography, flex and background come from the global classes in the template
.search-field {
    flex-shrink: 0;
    gap: var(--or-spacing-sm);
    width: 96px;
    height: 40px;
    border-radius: var(--or-radius-pill);
    transition: width 0.15s;
    cursor: text;

    &:focus-within {
        width: 200px;
    }

    // No native input look: the pill around it is the field
    &__input {
        padding: 0;
        border: 0;
        outline: 0;
        background: transparent;
        color: var(--or-text);

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
