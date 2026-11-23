<template>
    <div
        class="track-tabs row no-wrap items-center q-pa-xxs bg-control"
        :class="{ 'track-tabs--block': block, inline: !block }"
        role="tablist"
        :aria-label="t('tracks.label')"
    >
        <button
            v-for="track in tracks"
            :key="track.id"
            type="button"
            role="tab"
            class="track-tabs__tab plain-button text-center text-caption text-weight-bolder text-no-wrap"
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
// Typography, flex and background come from the global classes in the template.
// The tab colors stay here because the selected state changes them.
.track-tabs {
    border-radius: var(--or-radius-pill);

    &__tab {
        height: 36px;
        padding: 0 var(--or-spacing-md);
        border-radius: var(--or-radius-pill);
        color: var(--or-text-muted);

        &--selected {
            background: var(--q-accent);
            color: var(--or-text-on-accent);
        }
    }

    &--block .track-tabs__tab {
        flex: 1 1 0;
        padding: 0 var(--or-spacing-sm);
    }
}
</style>
