<template>
    <q-btn
        unelevated
        no-caps
        :color="tone === 'accent' ? 'primary' : undefined"
        :text-color="tone === 'accent' ? 'black' : undefined"
        class="action-button text-subtitle2"
        :class="[`action-button--${tone}`, { 'full-width': block }]"
        :label="label"
    />
</template>

<script setup lang="ts">
// Shared pill action button from the design (atom/Button/Action):
// neutral = outlined, accent = red with black text, inverted = white with black text.
// Disabled (the `disable` attribute) turns any tone into the grey Muted look.
withDefaults(
    defineProps<{
        label: string;
        tone?: 'neutral' | 'accent' | 'inverted';
        block?: boolean;
    }>(),
    { tone: 'neutral', block: false },
);
</script>

<style scoped lang="scss">
// Typography comes from the global class in the template
.action-button {
    min-height: 44px;
    padding: 0 var(--or-spacing-md-lg);
    white-space: pre;

    &--neutral {
        background: transparent;
        border: 1px solid var(--or-border-strong);
        color: var(--or-text);
    }

    &--inverted {
        background: var(--or-text);
        color: var(--or-text-on-accent);
    }

    &.disabled {
        border-color: transparent;
        background: var(--or-bg-control) !important;
        color: var(--or-text-placeholder) !important;
        opacity: 1 !important;
    }
}
</style>
