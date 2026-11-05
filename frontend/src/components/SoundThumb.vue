<template>
    <span
        class="sound-thumb"
        :class="[`sound-thumb--${size}`, { 'sound-thumb--active': active }]"
        aria-hidden="true"
    >
        <span
            v-for="(height, index) in BARS[size]"
            :key="index"
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
.sound-thumb {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    gap: 2.2px;
    border-radius: 50%;
    background: var(--or-bg-control);

    span {
        width: 3px;
        border-radius: 1px;
        background: var(--or-text-soft);
    }

    &--36 {
        gap: 1.8px;
        width: 36px;
        height: 36px;
    }

    &--44 {
        width: 44px;
        height: 44px;
    }

    &--active span {
        background: var(--q-primary);
    }
}
</style>
