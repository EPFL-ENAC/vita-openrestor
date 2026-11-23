<template>
    <workspace-page flush>
        <template v-if="entry && track">
            <header
                class="model-page__heading column no-wrap"
                :class="{ 'model-page__heading--compact': !isDesktop }"
            >
                <back-button :to="{ name: 'leaderboard' }" :label="t('pages.leaderboard.title')" />
                <div class="model-page__identity row no-wrap items-center q-mb-md">
                    <model-avatar
                        :name="entry.model.name"
                        :mine="submissions.isMine(entry.model.id)"
                        :size="isDesktop ? 88 : 56"
                    />
                    <div class="model-page__identity-text col-shrink column no-wrap">
                        <p
                            class="text-body2 text-weight-bolder q-my-none"
                            :class="{ 'text-primary': !isDesktop }"
                        >
                            {{ t('leaderboard.model.eyebrow', { rank, track: track.name }) }}
                        </p>
                        <h1 class="text-h1 ellipsis q-my-none">{{ entry.model.name }}</h1>
                        <p class="text-body1 q-my-none" :class="{ 'text-muted': !isDesktop }">
                            {{
                                t('leaderboard.model.attribution', {
                                    lab: entry.model.lab,
                                    date: d(new Date(entry.model.card.approvedAt), {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    }),
                                })
                            }}
                        </p>
                    </div>
                </div>
            </header>

            <div
                class="model-page__body column no-wrap"
                :class="{ 'model-page__body--compact': !isDesktop }"
            >
                <div class="model-page__actions row items-center">
                    <button
                        type="button"
                        class="model-page__play plain-button flex"
                        :aria-label="isSelectedPlaying ? t('player.pause') : t('player.play')"
                        @click="playSelected()"
                    >
                        <img :src="playIcon" width="56" height="56" alt="" />
                    </button>
                    <a
                        v-for="link in links"
                        :key="link.key"
                        :href="link.href"
                        target="_blank"
                        rel="noopener"
                        class="model-page__link row inline no-wrap items-center q-px-sm-md text-subtitle2 bg-control"
                    >
                        {{ t(`leaderboard.model.links.${link.key}`) }} ↗
                    </a>
                </div>

                <div
                    class="model-page__metadata row items-center justify-between"
                    :class="{ 'no-wrap': isDesktop }"
                >
                    <div class="model-page__chips row text-caption text-weight-bold text-soft">
                        <span class="model-page__track row inline no-wrap items-center">
                            <img :src="databaseIcon" width="12" height="12" alt="" />
                            {{ track.name }}
                        </span>
                        <span
                            class="model-page__chip row inline no-wrap items-center q-px-sm text-no-wrap bg-control"
                        >
                            {{ entry.model.card.architecture }}
                        </span>
                        <span
                            class="model-page__chip row inline no-wrap items-center q-px-sm text-no-wrap bg-control"
                        >
                            {{ entry.model.card.parameters }}
                        </span>
                        <span
                            class="model-page__chip row inline no-wrap items-center q-px-sm text-no-wrap bg-control"
                        >
                            {{
                                t('leaderboard.model.trainedOn', {
                                    data: entry.model.card.trainedOn,
                                })
                            }}
                        </span>
                    </div>
                    <div
                        v-if="isDesktop"
                        class="model-page__scores row no-wrap items-center text-body1 text-no-wrap"
                    >
                        <span
                            >{{ formatSnr(entry.snrGain) }}
                            {{ t('leaderboard.metrics.snrGain') }}</span
                        >
                        <span>
                            <strong class="text-weight-bolder">{{
                                formatListening(entry.listening)
                            }}</strong>
                            <span class="text-body2 text-muted"
                                >&nbsp;{{ t('leaderboard.listeningWord') }}</span
                            >
                        </span>
                        <sample-data-badge />
                    </div>
                </div>

                <template v-if="!isDesktop">
                    <div class="model-page__metric-cards">
                        <div class="model-page__metric-card column no-wrap bg-surface text-body2">
                            <strong class="text-h4">{{ formatSnr(entry.snrGain) }}</strong>
                            <span class="text-muted">{{ t('leaderboard.metrics.snrGain') }}</span>
                        </div>
                        <div class="model-page__metric-card column no-wrap bg-surface text-body2">
                            <strong class="text-h4">{{ formatListening(entry.listening) }}</strong>
                            <span class="text-muted">{{ t('leaderboard.metrics.listening') }}</span>
                        </div>
                    </div>

                    <div
                        v-if="selected"
                        class="model-page__compare-card column no-wrap bg-surface text-body2"
                    >
                        <strong class="text-subtitle2 text-weight-bolder">{{
                            t('leaderboard.compare.mobileTitle', { sample: selected.id })
                        }}</strong>
                        <span class="text-muted">{{ t('leaderboard.compare.mobileHint') }}</span>
                        <version-selector
                            class="self-start q-mt-xs"
                            :model-value="isSelectedLoaded ? player.version : 'restored'"
                            :versions="AUDIO_VERSIONS"
                            @update:model-value="listen"
                        />
                    </div>
                </template>

                <section class="model-page__section column no-wrap">
                    <div class="model-page__section-text column no-wrap">
                        <h2 class="text-h5 q-my-none">
                            {{ t('leaderboard.samples.title') }}
                        </h2>
                        <p class="text-body2 text-muted q-my-none">
                            {{
                                t('leaderboard.samples.subtitle', { n: board?.samples.length ?? 0 })
                            }}
                        </p>
                    </div>
                    <sample-table
                        :samples="board?.samples ?? []"
                        :snr="entry.sampleSnr"
                        :selected-id="selectedId"
                        :playing-id="isSelectedPlaying ? selectedId : null"
                        :compact="!isDesktop"
                        :category-of="categoryOf"
                        @select="selectSample"
                        @category="showCategory"
                    />
                </section>

                <section
                    v-if="metrics"
                    ref="metricsSection"
                    class="model-page__section model-page__section--metrics column no-wrap"
                >
                    <div class="model-page__metrics-heading row items-end justify-between">
                        <div class="model-page__section-text column no-wrap">
                            <h2 class="text-h5 q-my-none">
                                {{ t('leaderboard.metricsTable.title') }}
                            </h2>
                            <p class="text-body2 text-muted q-my-none">
                                {{
                                    t('leaderboard.metricsTable.subtitle', {
                                        clips: n(metricSummary?.items ?? 0),
                                        version: metrics.benchmarkVersion,
                                    })
                                }}
                            </p>
                        </div>
                        <filter-control
                            v-if="categoryOptions.length"
                            :label="categoryLabel"
                            :options="categoryOptions"
                            :model-value="category"
                            :all-label="t('leaderboard.metricsTable.allCategories')"
                            :block="!isDesktop"
                            @update:model-value="selectCategory"
                        />
                    </div>
                    <metrics-table
                        v-if="metricSummary"
                        :summary="metricSummary"
                        :compact="!isDesktop"
                    />
                </section>
            </div>
        </template>

        <p v-else-if="board" class="q-ma-lg text-muted">
            {{ t('leaderboard.model.notFound') }}
        </p>

        <template v-if="isDesktop && entry && selected" #aside>
            <compare-panel
                :sample="selected"
                :peaks="peaks"
                :loaded="isSelectedLoaded"
                :others="others"
                @listen="listen"
            />
        </template>
    </workspace-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useDatasetsStore } from 'src/stores/datasets';
import { peaksFor, useLeaderboardStore } from 'src/stores/leaderboard';
import { AUDIO_VERSIONS, usePlayerStore, type AudioVersion } from 'src/stores/player';
import WorkspacePage from 'components/layout/WorkspacePage.vue';
import ModelAvatar from 'components/ModelAvatar.vue';
import BackButton from 'components/BackButton.vue';
import { useSubmissionsStore } from 'src/stores/submissions';
import SampleDataBadge from 'components/SampleDataBadge.vue';
import VersionSelector from 'components/player/VersionSelector.vue';
import SampleTable from 'components/leaderboard/SampleTable.vue';
import MetricsTable from 'components/leaderboard/MetricsTable.vue';
import FilterControl from 'components/FilterControl.vue';
import { EFFECT_CATEGORIES, type ModelMetrics } from 'src/types/metrics';
import ComparePanel from 'components/leaderboard/ComparePanel.vue';
import { formatListening, formatSnr } from 'components/leaderboard/format';
import playIcon from 'assets/icons/play-accent-56.svg';
import databaseIcon from 'assets/icons/database-12.svg';
import type { TestSample } from 'src/types/leaderboard';

// Model page: one model on the selected track. Lists the test samples it restored;
// clicking one plays it, and the compare panel switches between original, degraded
// and restored at the same position, or jumps to another model on the same sample.
// Below: every metric of the scoring pipeline on the test split, overall or for one
// degradation category.
const OTHER_MODELS = 3;

const $q = useQuasar();
const route = useRoute();
const { t, d, n } = useI18n();
const submissions = useSubmissionsStore();
const datasets = useDatasetsStore();
const leaderboard = useLeaderboardStore();
const player = usePlayerStore();

const isDesktop = computed(() => $q.screen.gt.sm);
const modelId = computed(() => String(route.params.modelId));
const board = computed(() => leaderboard.board);
const track = computed(() => datasets.track);
const entry = computed(() => leaderboard.entry(modelId.value));
const rank = computed(() => leaderboard.rank(modelId.value));

const selectedId = ref<string | null>(null);
const selected = computed(
    () => board.value?.samples.find((s) => s.id === selectedId.value) ?? null,
);
const isSelectedLoaded = computed(
    () => !!entry.value && !!selected.value && leaderboard.isLoaded(entry.value, selected.value.id),
);
const isSelectedPlaying = computed(() => isSelectedLoaded.value && player.isPlaying);
const peaks = computed(() =>
    selected.value && board.value
        ? peaksFor(`${board.value.trackId}/${modelId.value}/${selected.value.id}`)
        : [],
);

const links = computed(() => {
    const card = entry.value?.model.card;
    if (!card) {
        return [];
    }
    return (['code', 'weights', 'paper'] as const)
        .filter((key) => card.links[key] !== null)
        .map((key) => ({ key, href: card.links[key] ?? '' }));
});

// Other models on the selected sample, in leaderboard order
const others = computed(() =>
    leaderboard.ranked
        .map((e, index) => ({ entry: e, rank: index + 1 }))
        .filter((o) => o.entry.model.id !== modelId.value)
        .slice(0, OTHER_MODELS),
);

onMounted(async () => {
    if (!datasets.catalog) {
        await datasets.load();
    }
});

watch(
    () => datasets.trackId,
    async (id) => {
        if (id && leaderboard.board?.trackId !== id) {
            await leaderboard.load(id);
        }
    },
    { immediate: true },
);

// Pick the sample: from ?sample=, else the one of this model already playing, else the first
watch(
    [board, modelId, () => route.query.sample],
    () => {
        const samples = board.value?.samples ?? [];
        const fromQuery = samples.find((s) => s.id === route.query.sample);
        const playing = leaderboard.nowPlaying;
        const fromPlayer = playing?.entry.model.id === modelId.value ? playing.sample : null;
        selectedId.value = (fromQuery ?? fromPlayer ?? samples[0])?.id ?? null;
    },
    { immediate: true },
);

// Metrics of this model on the selected track; null while loading
const metrics = ref<ModelMetrics | null>(null);
// Degradation category shown; null for all clips
const category = ref<string | null>(null);

watch(
    [() => datasets.trackId, modelId],
    async ([trackId, id]) => {
        metrics.value = null;
        category.value = null;
        if (!trackId) {
            return;
        }
        const loaded = await leaderboard.loadMetrics(trackId, id);
        if (trackId === datasets.trackId && id === modelId.value) {
            metrics.value = loaded;
        }
    },
    { immediate: true },
);

const metricSummary = computed(() => {
    if (!metrics.value) {
        return null;
    }
    return category.value
        ? (metrics.value.byCategory[category.value] ?? null)
        : metrics.value.overall;
});

const categoryOptions = computed(() =>
    Object.keys(metrics.value?.byCategory ?? {}).map((value) => ({ value, label: value })),
);
const categoryLabel = computed(() =>
    t('leaderboard.metricsTable.category', {
        category: category.value ?? t('leaderboard.metricsTable.allCategories'),
    }),
);

function selectCategory(value: string[] | string | null) {
    category.value = typeof value === 'string' ? value : null;
}

// Metrics category of a sample's degradation, when the metrics report it
function categoryOf(degradation: string): string | null {
    const name = EFFECT_CATEGORIES[degradation];
    return name && metrics.value?.byCategory[name] ? name : null;
}

const metricsSection = ref<HTMLElement | null>(null);

// Degradation tag of a sample: show the metrics of its category
function showCategory(name: string) {
    category.value = name;
    metricsSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function playSelected(version?: AudioVersion) {
    if (!entry.value || !selected.value || !track.value) {
        return;
    }
    return leaderboard.play(entry.value, track.value.name, selected.value, version);
}

function selectSample(sample: TestSample) {
    if (sample.id === selectedId.value) {
        return playSelected();
    }
    selectedId.value = sample.id;
    return playSelected('restored');
}

// Compare: listen to one source of the selected sample, keeping the position
function listen(version: AudioVersion) {
    if (isSelectedLoaded.value) {
        return version === player.version ? player.toggle() : player.setVersion(version);
    }
    return playSelected(version);
}
</script>

<style scoped lang="scss">
// Typography, colors, flex and simple spacing come from the global classes in the template.
// Only the gaps, grids, fixed sizes, borders and the paddings that change in compact mode stay here.
.model-page {
    &__heading {
        gap: var(--or-spacing-md);
        min-height: 168px;
        padding: var(--or-spacing-lg) var(--or-spacing-lg) 0;
        border-bottom: 1px solid var(--or-border);

        &--compact {
            min-height: 0;
            padding: var(--or-spacing-md) var(--or-spacing-md) 0;
            border-bottom: 0;
        }
    }

    &__identity {
        gap: var(--or-spacing-md-lg);
    }

    &__identity-text {
        gap: var(--or-spacing-xxs);
    }

    &__body {
        gap: var(--or-spacing-md);
        padding: var(--or-spacing-md-lg) var(--or-spacing-lg) var(--or-spacing-lg);

        &--compact {
            padding: var(--or-spacing-md) var(--or-spacing-md) var(--or-spacing-lg);
        }
    }

    &__actions {
        gap: var(--or-spacing-md);
    }

    &__play {
        border-radius: 50%;
    }

    &__link {
        height: 36px;
        border-radius: var(--or-radius-pill);
        color: var(--or-text);
        text-decoration: none;
    }

    &__metadata,
    &__chips,
    &__scores {
        gap: var(--or-spacing-sm);
    }

    &__track {
        gap: var(--or-spacing-xs);
        height: 22px;
        padding: 0 var(--or-spacing-sm) 0 var(--or-spacing-xs);
        border: 1px solid var(--or-border-strong);
        border-radius: var(--or-radius-sm);
    }

    &__chip {
        height: 22px;
        border-radius: var(--or-radius-pill);
    }

    &__metric-cards {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--or-spacing-sm-md);
    }

    &__metric-card,
    &__compare-card {
        gap: var(--or-spacing-xxs);
        padding: var(--or-spacing-sm-md) var(--or-spacing-md);
        border-radius: var(--or-radius-lg);
    }

    &__compare-card {
        gap: var(--or-spacing-xs);
    }

    // Test samples, then metrics: same heading, a line and more room between them
    &__section {
        gap: var(--or-spacing-sm-md);
        margin-top: var(--or-spacing-md);

        &--metrics {
            margin-top: var(--or-spacing-xl);
            padding-top: var(--or-spacing-xl);
            border-top: 1px solid var(--or-border);
        }
    }

    &__section-text {
        gap: var(--or-spacing-xs);
    }

    &__metrics-heading {
        gap: var(--or-spacing-sm-md) var(--or-spacing-md);
    }
}
</style>
