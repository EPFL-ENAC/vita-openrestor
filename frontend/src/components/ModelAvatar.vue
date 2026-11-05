<template>
    <span
        class="model-avatar"
        :class="[`model-avatar--${size}`, { 'model-avatar--mine': mine }]"
        aria-hidden="true"
    >
        {{ initials }}
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Marks a model (atom/Identity/Model avatar): rounded square with its initials.
// Neutral for everyone else's models; red for the signed-in researcher's own models.
// Never used for sounds or datasets.
const props = withDefaults(
    defineProps<{
        name: string;
        // One of the signed-in researcher's models
        mine?: boolean;
        size?: 28 | 32 | 36 | 56 | 88;
    }>(),
    { size: 36 },
);

// First two capitals of the name (WaveMend → WM), else its first two letters
const initials = computed(() => {
    const capitals = props.name.match(/[A-Z]/g) ?? [];
    return (
        capitals.length >= 2 ? capitals.slice(0, 2).join('') : props.name.slice(0, 2)
    ).toUpperCase();
});
</script>

<style scoped lang="scss">
.model-avatar {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border-radius: 25%;
    background: var(--or-bg-control);
    color: var(--or-text-soft);
    font-weight: 800;
    letter-spacing: 0.02em;
    line-height: 1;

    &--mine {
        background: var(--q-primary);
        color: var(--or-text-on-accent);
    }

    &--28 {
        width: 28px;
        height: 28px;
        font-size: 11px;
    }

    &--32 {
        width: 32px;
        height: 32px;
        font-size: 12px;
    }

    &--36 {
        width: 36px;
        height: 36px;
        font-size: 14px;
    }

    &--56 {
        width: 56px;
        height: 56px;
        font-size: 21px;
    }

    &--88 {
        width: 88px;
        height: 88px;
        font-size: 33px;
    }
}
</style>
