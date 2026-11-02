<template>
    <button type="button" class="filter-control" :class="{ 'filter-control--block': block }">
        <span class="filter-control__label">{{ label }}</span>
        <img :src="expandIcon" width="8" height="4" alt="" class="filter-control__expand" />
        <q-menu fit-min class="bg-surface">
            <q-list dense style="min-width: 200px">
                <q-item v-if="allLabel" clickable :active="allSelected" @click="selectAll">
                    <q-item-section>{{ allLabel }}</q-item-section>
                </q-item>
                <q-item
                    v-for="option in options"
                    :key="option.value"
                    v-close-popup="!multiple"
                    clickable
                    :active="!multiple && modelValue === option.value"
                    @click="toggle(option.value)"
                >
                    <q-item-section v-if="multiple" side>
                        <q-checkbox
                            :model-value="isSelected(option.value)"
                            dense
                            @update:model-value="toggle(option.value)"
                        />
                    </q-item-section>
                    <q-item-section>{{ option.label }}</q-item-section>
                </q-item>
            </q-list>
        </q-menu>
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FilterOption } from 'src/types/filters';
import expandIcon from 'assets/icons/expand-8.svg';

// Pill filter with a dropdown (molecule/Filters/Control).
// multiple: modelValue is a list; otherwise a single value, null meaning "all".
const props = defineProps<{
    label: string;
    options: FilterOption[];
    modelValue: string[] | string | null;
    multiple?: boolean;
    // Adds a first item that selects everything (multiple) or clears the value (single)
    allLabel?: string;
    // Full width, taller (mobile)
    block?: boolean;
}>();

const emit = defineEmits<{ 'update:modelValue': [value: string[] | string | null] }>();

const selectedValues = computed(() => (Array.isArray(props.modelValue) ? props.modelValue : []));
const allSelected = computed(() =>
    props.multiple
        ? selectedValues.value.length === props.options.length
        : props.modelValue === null,
);

function isSelected(value: string): boolean {
    return selectedValues.value.includes(value);
}

function toggle(value: string) {
    if (!props.multiple) {
        emit('update:modelValue', value);
        return;
    }
    emit(
        'update:modelValue',
        isSelected(value)
            ? selectedValues.value.filter((v) => v !== value)
            : [...selectedValues.value, value],
    );
}

function selectAll() {
    emit('update:modelValue', props.multiple ? props.options.map((o) => o.value) : null);
}
</script>

<style scoped lang="scss">
.filter-control {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    height: 36px;
    min-width: 0;
    padding: 0 14px;
    border: 0;
    border-radius: var(--or-radius-pill);
    background: var(--or-bg-control);
    color: var(--or-text);
    font-family: 'Roboto', sans-serif;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;

    &__label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &__expand {
        flex-shrink: 0;
    }

    &--block {
        width: 100%;
        height: 44px;
    }
}
</style>
