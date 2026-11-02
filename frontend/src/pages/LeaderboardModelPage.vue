<template>
    <workspace-page flush>
        <template v-if="entry && track">
            <header
                class="model-page__heading"
                :class="{ 'model-page__heading--compact': !isDesktop }"
            >
                <back-button :to="{ name: 'leaderboard' }" :label="t('pages.leaderboard.title')" />
                <div class="model-page__identity">
                    <model-avatar
                        :name="entry.model.name"
                        :mine="submissions.isMine(entry.model.id)"
                        :size="isDesktop ? 88 : 56"
                    />
                    <div class="model-page__identity-text">
                        <p class="model-page__eyebrow">
                            {{ t('leaderboard.model.eyebrow', { rank, track: track.name }) }}
                        </p>
                        <h1 class="model-page__title">{{ entry.model.name }}</h1>
                        <p class="model-page__attribution">
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

            <div class="model-page__body" :class="{ 'model-page__body--compact': !isDesktop }">
                <div class="model-page__actions">
                    <button
                        type="button"
                        class="model-page__play"
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
                        class="model-page__link"
                    >
                        {{ t(`leaderboard.model.links.${link.key}`) }} ↗
                    </a>
                </div>

                <div class="model-page__metadata">
                    <div class="model-page__chips">
                        <span class="model-page__track">
                            <img :src="databaseIcon" width="12" height="12" alt="" />
                            {{ track.name }}
                        </span>
                        <span class="model-page__chip">{{ entry.model.card.architecture }}</span>
                        <span class="model-page__chip">{{ entry.model.card.parameters }}</span>
                        <span class="model-page__chip">
                            {{
                                t('leaderboard.model.trainedOn', {
                                    data: entry.model.card.trainedOn,
                                })
                            }}
                        </span>
                    </div>
                    <div v-if="isDesktop" class="model-page__scores">
                        <span
                            >{{ formatSnr(entry.snrGain) }}
                            {{ t('leaderboard.metrics.snrGain') }}</span
                        >
                        <span>
                            <strong>{{ formatListening(entry.listening) }}</strong>
                            <span class="text-muted"
                                >&nbsp;{{ t('leaderboard.listeningWord') }}</span
                            >
                        </span>
                        <sample-data-badge />
                    </div>
                </div>

                <template v-if="!isDesktop">
                    <div class="model-page__metric-cards">
                        <div class="model-page__metric-card">
                            <strong>{{ formatSnr(entry.snrGain) }}</strong>
                            <span class="text-muted">{{ t('leaderboard.metrics.snrGain') }}</span>
                        </div>
                        <div class="model-page__metric-card">
                            <strong>{{ formatListening(entry.listening) }}</strong>
                            <span class="text-muted">{{ t('leaderboard.metrics.listening') }}</span>
                        </div>
                    </div>

                    <div v-if="selected" class="model-page__compare-card">
                        <strong>{{
                            t('leaderboard.compare.mobileTitle', { sample: selected.id })
                        }}</strong>
                        <span class="text-muted">{{ t('leaderboard.compare.mobileHint') }}</span>
                        <version-selector
                            :model-value="isSelectedLoaded ? player.version : 'restored'"
                            :versions="AUDIO_VERSIONS"
                            @update:model-value="listen"
                        />
                    </div>
                </template>

                <section class="model-page__section">
                    <div class="model-page__section-text">
                        <h2 class="model-page__section-title">
                            {{ t('leaderboard.samples.title') }}
                        </h2>
                        <p class="text-muted">
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
                    class="model-page__section model-page__section--metrics"
                >
                    <div class="model-page__metrics-heading">
                        <div class="model-page__section-text">
                            <h2 class="model-page__section-title">
                                {{ t('leaderboard.metricsTable.title') }}
                            </h2>
                            <p class="text-muted">
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

        <p v-else-if="board" class="model-page__missing text-muted">
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
.model-page {
    &__heading {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 24px 24px 0;
        border-bottom: 1px solid var(--or-border);
        min-height: 168px;

        &--compact {
            min-height: 0;
            padding: 16px 16px 0;
            border-bottom: 0;

            .model-page__eyebrow {
                color: var(--q-primary);
            }

            .model-page__title {
                font-size: 32px;
            }

            .model-page__attribution {
                color: var(--or-text-muted);
            }
        }
    }

    &__identity {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 16px;
    }

    &__identity-text {
        display: flex;
        flex-direction: column;
        gap: 3px;
        min-width: 0;
        line-height: 1.25;

        p {
            margin: 0;
        }
    }

    &__eyebrow {
        font-size: 13px;
        font-weight: 800;
    }

    &__title {
        margin: 0;
        overflow: hidden;
        font-size: 48px;
        font-weight: 800;
        line-height: 1.25;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &__attribution {
        font-size: 14px;
    }

    &__body {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 20px 24px 24px;

        &--compact {
            padding: 16px 16px 24px;

            .model-page__metadata {
                flex-wrap: wrap;
            }
        }
    }

    &__actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 16px;
    }

    &__play {
        display: flex;
        padding: 0;
        border: 0;
        border-radius: 50%;
        background: none;
        cursor: pointer;
    }

    &__link {
        display: inline-flex;
        align-items: center;
        height: 36px;
        padding: 0 14px;
        border-radius: var(--or-radius-pill);
        background: var(--or-bg-control);
        color: var(--or-text);
        font-size: 14px;
        font-weight: 700;
        text-decoration: none;
    }

    &__metadata {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
    }

    &__chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    &__track {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        height: 22px;
        padding: 0 8px 0 6px;
        border: 1px solid var(--or-border-strong);
        border-radius: var(--or-radius-sm);
        color: var(--or-text-soft);
        font-size: 12px;
        font-weight: 600;
    }

    &__chip {
        display: inline-flex;
        align-items: center;
        height: 22px;
        padding: 0 10px;
        border-radius: var(--or-radius-pill);
        background: var(--or-bg-control);
        color: var(--or-text-soft);
        font-size: 12px;
        font-weight: 600;
        white-space: nowrap;
    }

    &__scores {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        white-space: nowrap;

        strong {
            font-weight: 800;
        }

        .text-muted {
            font-size: 13px;
        }
    }

    &__metric-cards {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
    }

    &__metric-card,
    &__compare-card {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 14px 16px;
        border-radius: var(--or-radius-lg);
        background: var(--or-bg-surface);
        font-size: 13px;

        strong {
            font-size: 20px;
            font-weight: 800;
        }
    }

    &__compare-card {
        gap: 6px;

        strong {
            font-size: 14px;
        }

        .version-selector {
            align-self: flex-start;
            margin-top: 6px;
        }
    }

    // Test samples, then metrics: same heading, a line and more room between them
    &__section {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 16px;

        &--metrics {
            margin-top: 40px;
            padding-top: 32px;
            border-top: 1px solid var(--or-border);
        }
    }

    &__section-text {
        display: flex;
        flex-direction: column;
        gap: 4px;

        p {
            margin: 0;
            font-size: 13px;
        }
    }

    &__section-title {
        margin: 0;
        font-family: inherit;
        font-size: 18px;
        font-weight: 800;
    }

    &__metrics-heading {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        justify-content: space-between;
        gap: 12px 16px;
    }

    &__missing {
        margin: 24px;
    }
}
</style>
