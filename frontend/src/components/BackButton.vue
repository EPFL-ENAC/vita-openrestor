<template>
    <router-link :to="to" class="back-button">
        <img :src="chevronLeftIcon" width="12" height="12" alt="" />
        {{ label }}
    </router-link>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';
import chevronLeftIcon from 'assets/icons/chevron-left-12.svg';

// Top of a detail page: back to the list it was opened from (atom/Button/Back)
defineProps<{
    to: RouteLocationRaw;
    // Name of that page
    label: string;
}>();
</script>

<style scoped lang="scss">
.back-button {
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    gap: 6px;
    height: 28px;
    padding: 0 12px 0 8px;
    border-radius: var(--or-radius-pill);
    background: var(--or-bg-control);
    color: var(--or-text-soft);
    font-size: 13px;
    font-weight: 700;
    text-decoration: none;
}
</style>
