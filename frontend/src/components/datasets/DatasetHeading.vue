<template>
    <header class="dataset-heading" :class="{ 'dataset-heading--compact': compact }">
        <p class="dataset-heading__description">
            {{ t('datasets.kind') }} · {{ t('datasets.subtitle') }}
        </p>
        <h1 class="dataset-heading__title">{{ t('pages.datasets.title') }}</h1>
        <p class="dataset-heading__metadata">
            {{
                compact
                    ? t('datasets.metadataShort', {
                          version: dataset.version,
                          licence: dataset.licence,
                      })
                    : t('datasets.metadata', {
                          version: dataset.version,
                          tracks: trackCount,
                          standards: dataset.metadataStandards.join(' + '),
                          licence: dataset.licence,
                      })
            }}
        </p>
    </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { DatasetInfo } from 'src/types/datasets';

defineProps<{
    dataset: DatasetInfo;
    trackCount: number;
    // Mobile layout
    compact?: boolean;
}>();

const { t } = useI18n();
</script>

<style scoped lang="scss">
.dataset-heading {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 40px 24px 28px;
    border-bottom: 1px solid var(--or-border);
    font-family: 'Roboto', sans-serif;

    p {
        margin: 0;
    }

    &__description {
        font-size: 14px;
        font-weight: 900;
    }

    &__title {
        margin: 0;
        font-size: 3.25rem; // 52px
        font-weight: 900;
        line-height: 1.15;
        letter-spacing: -0.015em;
    }

    &__metadata {
        color: var(--or-text-soft);
        font-size: 14px;
        font-weight: 500;
    }

    &--compact {
        padding: 20px 16px 20px;
        border-bottom: 0;

        .dataset-heading__description {
            color: var(--q-primary);
            font-size: 13px;
            font-weight: 700;
        }

        .dataset-heading__title {
            font-size: 2.1875rem; // 35px
            letter-spacing: -0.008em;
        }

        .dataset-heading__metadata {
            color: var(--or-text-muted);
            font-weight: 400;
        }
    }
}
</style>
