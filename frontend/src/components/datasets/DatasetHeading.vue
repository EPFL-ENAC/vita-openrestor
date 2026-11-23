<template>
    <header class="dataset-heading column no-wrap" :class="{ 'dataset-heading--compact': compact }">
        <p class="dataset-heading__description text-subtitle2 q-my-none">
            {{ t('datasets.kind') }} · {{ t('datasets.subtitle') }}
        </p>
        <h1 class="text-h1 q-my-none">{{ t('pages.datasets.title') }}</h1>
        <p class="dataset-heading__metadata text-body1 q-my-none">{{ metadata }}</p>
    </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { DatasetInfo } from 'src/types/datasets';

const props = defineProps<{
    dataset: DatasetInfo;
    trackCount: number;
    // Mobile layout
    compact?: boolean;
}>();

const { t } = useI18n();

const metadata = computed(() => {
    const { version, licence, metadataStandards } = props.dataset;
    if (props.compact) {
        return t('datasets.metadataShort', { version, licence });
    }
    return t('datasets.metadata', {
        version,
        licence,
        tracks: props.trackCount,
        standards: metadataStandards.join(' + '),
    });
});
</script>

<style scoped lang="scss">
.dataset-heading {
    gap: var(--or-spacing-xs);
    padding: var(--or-spacing-xl) var(--or-spacing-lg) var(--or-spacing-lg);
    border-bottom: 1px solid var(--or-border);

    &__metadata {
        color: var(--or-text-soft);
    }

    &--compact {
        padding: var(--or-spacing-md-lg) var(--or-spacing-md);
        border-bottom: 0;

        .dataset-heading__description {
            color: var(--q-primary);
        }

        .dataset-heading__metadata {
            color: var(--or-text-muted);
        }
    }
}
</style>
