<template>
    <span
        class="model-avatar row inline no-wrap items-center justify-center text-weight-bolder"
        :class="[`model-avatar--${size}`, TEXT_CLASSES[size], { 'model-avatar--mine': mine }]"
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

// Text style of the initials at each size. 88 has no class near 33px: its size is in the CSS.
const TEXT_CLASSES = {
    28: 'text-overline',
    32: 'text-caption',
    36: 'text-subtitle2',
    56: 'text-h4',
    88: '',
} as const;

// First two capitals of the name (WaveMend → WM), else its first two letters
const initials = computed(() => {
    const capitals = props.name.match(/[A-Z]/g) ?? [];
    return (
        capitals.length >= 2 ? capitals.slice(0, 2).join('') : props.name.slice(0, 2)
    ).toUpperCase();
});
</script>

<style scoped lang="scss">
// Typography and flex come from the global classes in the template. The colors stay here
// because the --mine modifier switches them.
.model-avatar {
    flex-shrink: 0;
    border-radius: 25%;
    background: var(--or-bg-control);
    color: var(--or-text-soft);
    // Centers the initials in the square
    line-height: 1;

    &--mine {
        background: var(--q-primary);
        color: var(--or-text-on-accent);
    }

    &--28 {
        width: 28px;
        height: 28px;
    }

    &--32 {
        width: 32px;
        height: 32px;
    }

    &--36 {
        width: 36px;
        height: 36px;
    }

    &--56 {
        width: 56px;
        height: 56px;
    }

    &--88 {
        width: 88px;
        height: 88px;
        font-size: 32px;
    }
}
</style>
