<template>
    <!-- No backend serves the dataset yet: the button does nothing for now -->
    <button type="button" class="split-download" :aria-label="a11yLabel">
        <img :src="downloadIcon" width="12" height="12" alt="" />
        {{ label }}
    </button>
</template>

<script setup lang="ts">
import downloadIcon from 'assets/icons/download-16.svg';

// One download button of a split card: outlined pill
defineProps<{
    label: string;
    // Full name read by screen readers ("Download original audio of the Train split")
    a11yLabel: string;
}>();
</script>

<style scoped lang="scss">
.split-download {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 32px;
    padding: 0 12px;
    border: 1px solid var(--or-border-strong);
    border-radius: var(--or-radius-pill);
    background: transparent;
    color: var(--or-text);
    font-family: inherit;
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
    cursor: pointer;

    &:hover {
        background: var(--or-bg-control);
    }
}
</style>
