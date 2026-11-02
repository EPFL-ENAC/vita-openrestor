<template>
    <div
        class="track-tabs"
        :class="{ 'track-tabs--block': block }"
        role="tablist"
        :aria-label="t('tracks.label')"
    >
        <button
            v-for="track in tracks"
            :key="track.id"
            type="button"
            role="tab"
            class="track-tabs__tab"
            :class="{ 'track-tabs__tab--selected': track.id === modelValue }"
            :aria-selected="track.id === modelValue"
            @click="emit('update:modelValue', track.id)"
        >
            {{ track.name }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

// Switch between the benchmark tracks (molecule/Leaderboard/Dataset tabs).
// Used on the datasets page and, later, on the leaderboard: every model is scored
// on every track, so the same tabs pick which ranking or which splits are shown.
defineProps<{
    tracks: readonly { id: string; name: string }[];
    modelValue: string | null;
    // Mobile: tabs share the full width
    block?: boolean;
}>();

const emit = defineEmits<{ 'update:modelValue': [trackId: string] }>();

const { t } = useI18n();
</script>

<style scoped lang="scss">
.track-tabs {
    display: inline-flex;
    align-items: center;
    padding: 2px;
    border-radius: var(--or-radius-pill);
    background: var(--or-bg-control);

    &__tab {
        height: 36px;
        padding: 0 16px;
        border: 0;
        border-radius: var(--or-radius-pill);
        background: transparent;
        color: var(--or-text-muted);
        font: inherit;
        font-size: 12px;
        font-weight: 800;
        white-space: nowrap;
        cursor: pointer;

        &--selected {
            background: var(--q-accent);
            color: var(--or-text-on-accent);
        }
    }

    &--block {
        display: flex;

        .track-tabs__tab {
            flex: 1 1 0;
            padding: 0 8px;
        }
    }
}
</style>
