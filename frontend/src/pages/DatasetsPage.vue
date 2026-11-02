<template>
    <workspace-page flush>
        <template v-if="catalog">
            <dataset-heading
                :dataset="catalog.dataset"
                :track-count="catalog.tracks.length"
                :compact="!isDesktop"
            />

            <div
                class="datasets-page__body"
                :class="{ 'datasets-page__body--compact': !isDesktop }"
            >
                <track-tabs
                    :tracks="catalog.tracks"
                    :model-value="datasets.trackId"
                    :block="!isDesktop"
                    @update:model-value="datasets.selectTrack"
                />

                <template v-if="track">
                    <p class="datasets-page__intro">
                        {{
                            t('datasets.trackIntro', {
                                track: track.name,
                                description: track.description,
                            })
                        }}
                    </p>

                    <split-card
                        v-for="split in track.splits"
                        :key="split.id"
                        :track-id="track.id"
                        :split="split"
                        :compact="!isDesktop"
                        @play="play"
                    />
                </template>
            </div>
        </template>

        <template v-if="catalog && track" #aside>
            <div class="datasets-page__panel">
                <h2 class="datasets-page__panel-title">{{ t('datasets.trackDetails') }}</h2>
                <track-details :track="track" :dataset="catalog.dataset" />
                <action-button
                    block
                    :label="`↓ ${t('datasets.recipes')}`"
                    @click="downloadRecipes"
                />
            </div>
        </template>
    </workspace-page>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { exportFile, useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useDatasetsStore } from 'src/stores/datasets';
import WorkspacePage from 'components/layout/WorkspacePage.vue';
import ActionButton from 'components/ActionButton.vue';
import TrackTabs from 'components/TrackTabs.vue';
import DatasetHeading from 'components/datasets/DatasetHeading.vue';
import SplitCard from 'components/datasets/SplitCard.vue';
import TrackDetails from 'components/datasets/TrackDetails.vue';
import type { DatasetSample, SplitId } from 'src/types/datasets';

// Datasets: pick a track, then download its train and test splits or listen to sample clips
const $q = useQuasar();
const { t } = useI18n();
const datasets = useDatasetsStore();

const isDesktop = computed(() => $q.screen.gt.sm);
const catalog = computed(() => datasets.catalog);
const track = computed(() => datasets.track);

function play(splitId: SplitId, sample: DatasetSample) {
    return datasets.play(splitId, t(`datasets.splits.${splitId}.name`), sample);
}

onMounted(async () => {
    if (!datasets.catalog) {
        await datasets.load();
    }
});

// Degradation list of the track, so a researcher can replicate each step
function downloadRecipes() {
    if (!catalog.value || !track.value) {
        throw new Error('No track selected');
    }
    const content = JSON.stringify(
        {
            track: track.value.id,
            version: catalog.value.dataset.version,
            versionsPerClip: track.value.versionsPerClip,
            degradations: track.value.degradations,
        },
        null,
        2,
    );
    const result = exportFile(
        `${track.value.id}-${catalog.value.dataset.version}.recipes.json`,
        content,
        'application/json',
    );
    if (result !== true) {
        throw result;
    }
}
</script>

<style scoped lang="scss">
.datasets-page {
    &__body {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
        padding: 24px;

        > :deep(.split-card) {
            align-self: stretch;
        }

        &--compact {
            align-items: stretch;
            gap: 12px;
            padding: 0 16px 24px;
        }
    }

    &__intro {
        margin: 0;
        color: var(--or-text-soft);
        font-size: 14px;
        line-height: 1.4;
    }

    &__panel {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-top: 6px;
        font-family: 'Roboto', sans-serif;
    }

    &__panel-title {
        margin: 0;
        font-size: 16px;
        font-weight: 900;
        line-height: 1.2;
    }
}
</style>
