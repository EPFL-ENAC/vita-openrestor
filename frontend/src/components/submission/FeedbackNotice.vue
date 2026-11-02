<template>
    <div class="feedback-notice" :class="`feedback-notice--${tone}`">
        <p class="feedback-notice__title">{{ title }}</p>
        <p class="feedback-notice__body">{{ body }}</p>
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
.feedback-notice {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 16px;
    border-radius: var(--or-radius-lg);
    background: var(--or-bg-raised);

    p {
        margin: 0;
    }

    &__title {
        font-size: 14px;
        font-weight: 800;
        line-height: 1.25;
    }

    &__body {
        color: var(--or-text-muted);
        font-size: 13px;
        line-height: 1.3;
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
