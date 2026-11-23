<template>
    <div class="feedback-notice q-pa-md rounded-lg" :class="`feedback-notice--${tone}`">
        <p class="text-subtitle2 text-weight-bolder q-my-none">{{ title }}</p>
        <p class="feedback-notice__body text-body2 q-mt-xs q-mb-none">{{ body }}</p>
    </div>
</template>

<script setup lang="ts">
// Guidance notice (molecule/Feedback/Notice): neutral for status guidance,
// success for a positive decision
withDefaults(
    defineProps<{
        title: string;
        body: string;
        tone?: 'neutral' | 'success';
    }>(),
    { tone: 'neutral' },
);
</script>

<style scoped lang="scss">
// Typography and spacing come from the global classes in the template.
// The background and body color stay here: the success tone swaps them, and the
// bg-raised / text-muted classes (!important) would win over that.
.feedback-notice {
    background: var(--or-bg-raised);

    &__body {
        color: var(--or-text-muted);
    }

    &--success {
        border: 1px solid var(--or-border-success);
        background: var(--or-bg-success);

        .feedback-notice__body {
            color: var(--or-text-success);
        }
    }
}
</style>
