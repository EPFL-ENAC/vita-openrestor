<template>
    <span class="app-icon" :style="style" aria-hidden="true" />
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Renders a design SVG as a mask so it takes the current text color (active / inactive states).
const props = defineProps<{
    src: string;
    size: number;
}>();

const style = computed(() => ({
    width: `${props.size}px`,
    height: `${props.size}px`,
    // Quoted: Vite inlines small SVGs as data URLs that contain quotes
    maskImage: `url("${props.src}")`,
    WebkitMaskImage: `url("${props.src}")`,
}));
</script>

<style scoped lang="scss">
.app-icon {
    display: inline-block;
    flex-shrink: 0;
    background-color: currentColor;
    mask-repeat: no-repeat;
    mask-position: center;
    mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
    -webkit-mask-size: contain;
}
</style>
