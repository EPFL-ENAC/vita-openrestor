<template>
    <!-- No backend serves the dataset yet: the button does nothing for now -->
    <button
        type="button"
        class="split-download plain-button row inline no-wrap items-center rounded-pill text-caption text-weight-bold text-no-wrap"
        :aria-label="a11yLabel"
    >
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
    gap: var(--or-spacing-xs);
    height: 32px;
    padding: 0 var(--or-spacing-sm-md);
    border: 1px solid var(--or-border-strong);
    color: var(--or-text);

    &:hover {
        background: var(--or-bg-control);
    }
}
</style>
