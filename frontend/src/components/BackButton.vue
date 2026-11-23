<template>
    <router-link
        :to="to"
        class="back-button row inline no-wrap items-center self-start text-body2 text-weight-bold text-soft bg-control"
    >
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
// Typography, colors and flex come from the global classes in the template
.back-button {
    gap: var(--or-spacing-xs);
    height: 28px;
    padding: 0 var(--or-spacing-sm-md) 0 var(--or-spacing-sm);
    border-radius: var(--or-radius-pill);
    text-decoration: none;
}
</style>
