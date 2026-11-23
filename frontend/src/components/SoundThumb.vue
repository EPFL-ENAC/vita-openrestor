<template>
    <span
        class="sound-thumb row inline no-wrap items-center justify-center bg-control"
        :class="[`sound-thumb--${size}`, { 'sound-thumb--active': active }]"
        aria-hidden="true"
    >
        <span
            v-for="(height, index) in BARS[size]"
            :key="index"
            class="sound-thumb__bar"
            :style="{ height: `${height}px` }"
        />
    </span>
</template>

<script setup lang="ts">
// Marks a sound (atom/Identity/Sound thumb): circle with five waveform bars,
// red when the sound is selected or loaded in the player.
withDefaults(
    defineProps<{
        active?: boolean;
        size?: 36 | 44;
    }>(),
    { size: 44 },
);

const BARS = { 36: [7, 13, 18, 13, 7], 44: [9, 15, 22, 15, 9] } as const;
</script>

<style scoped lang="scss">
// Flex and background come from the global classes in the template
.sound-thumb {
    flex-shrink: 0;
    gap: var(--or-spacing-xxs);
    border-radius: var(--or-radius-pill);

    &__bar {
        width: 3px;
        border-radius: 1px;
        background: var(--or-text-soft);
    }

    &--36 {
        width: 36px;
        height: 36px;
    }

    &--44 {
        width: 44px;
        height: 44px;
    }

    &--active .sound-thumb__bar {
        background: var(--q-primary);
    }
}
</style>
