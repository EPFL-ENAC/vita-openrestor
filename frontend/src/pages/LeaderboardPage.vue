<template>
    <workspace-page flush>
        <header
            class="leaderboard-page__header column no-wrap"
            :class="{ 'items-start': isDesktop, 'leaderboard-page__header--compact': !isDesktop }"
        >
            <p
                class="q-my-none"
                :class="
                    isDesktop
                        ? 'text-body2 text-weight-bolder'
                        : 'text-caption text-weight-bold text-primary'
                "
            >
                {{
                    isDesktop
                        ? t('leaderboard.release', { release: release })
                        : t('leaderboard.releaseShort', { release: release })
                }}
            </p>
            <div
                class="leaderboard-page__title-row row no-wrap items-end justify-between self-stretch"
            >
                <h1 class="text-h1 q-my-none">{{ t('pages.leaderboard.title') }}</h1>
                <div v-if="isDesktop" class="leaderboard-page__filters row no-wrap items-center">
                    <sample-data-badge />
                    <filter-control
                        :label="sortLabel"
                        :options="sortOptions"
                        :model-value="leaderboard.sort"
                        @update:model-value="setSort"
                    />
                </div>
            </div>
            <track-tabs
                v-if="tracks.length"
                :tracks="tracks"
                :model-value="trackId"
                :block="!isDesktop"
                @update:model-value="selectTrack"
            />
            <div
                v-if="!isDesktop"
                class="leaderboard-page__filters leaderboard-page__filters--compact row no-wrap items-start"
            >
                <filter-control
                    :label="sortLabel"
                    :options="sortOptions"
                    :model-value="leaderboard.sort"
                    @update:model-value="setSort"
                />
                <sample-data-badge />
            </div>
        </header>

        <div
            v-if="podium.length"
            class="leaderboard-page__body"
            :class="{ 'leaderboard-page__body--compact': !isDesktop }"
        >
            <div v-if="isDesktop" class="leaderboard-page__podium">
                <podium-card
                    v-for="(entry, index) in podium"
                    :key="entry.model.id"
                    :entry="entry"
                    :rank="podiumRank(index)"
                    layout="desktop"
                    :playing="leaderboard.isPlaying(entry)"
                    @play="play(entry)"
                />
            </div>
            <div v-else class="leaderboard-page__podium leaderboard-page__podium--compact">
                <podium-card
                    :entry="podium[0]!"
                    :rank="1"
                    layout="winner"
                    :playing="leaderboard.isPlaying(podium[0]!)"
                    @play="play(podium[0]!)"
                />
                <div class="leaderboard-page__runners-up">
                    <podium-card
                        v-for="(entry, index) in podium.slice(1)"
                        :key="entry.model.id"
                        :entry="entry"
                        :rank="podiumRank(index + 1)"
                        layout="compact"
                        :playing="leaderboard.isPlaying(entry)"
                        @play="play(entry)"
                    />
                </div>
            </div>

            <section v-if="rest.length" class="leaderboard-page__ranking column no-wrap">
                <h2 class="text-h4 q-my-none">{{ t('leaderboard.fullRanking') }}</h2>
                <ranking-table
                    :entries="rest"
                    :first-rank="podium.length + 1"
                    :compact="!isDesktop"
                    :loading="leaderboard.loading"
                />
            </section>
        </div>

        <p v-else-if="leaderboard.board" class="q-ma-lg text-muted">
            {{ t('leaderboard.empty') }}
        </p>

        <template v-if="isDesktop" #aside>
            <div class="leaderboard-page__panel column no-wrap q-pt-xs">
                <h2 class="text-h6 q-my-none">{{ t('leaderboard.nowPlaying') }}</h2>
                <div class="leaderboard-page__track row no-wrap items-center q-pt-xxs">
                    <sound-thumb :active="leaderboard.nowPlaying !== null" />
                    <span class="leaderboard-page__track-text col-shrink column no-wrap text-body1">
                        <span class="text-h4 ellipsis">
                            {{
                                leaderboard.nowPlaying
                                    ? player.track?.title
                                    : t('player.nothingPlaying')
                            }}
                        </span>
                        <span class="text-muted">
                            {{
                                leaderboard.nowPlaying
                                    ? `${leaderboard.nowPlaying.entry.model.name} · ${t(`player.versions.${player.version}`)}`
                                    : t('leaderboard.pressPlay')
                            }}
                        </span>
                    </span>
                </div>
                <score-explanation />
                <action-button
                    tone="accent"
                    block
                    :label="t('library.submitModel')"
                    :to="{ name: 'submission-new' }"
                />
            </div>
        </template>
    </workspace-page>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useDatasetsStore } from 'src/stores/datasets';
import { useLeaderboardStore } from 'src/stores/leaderboard';
import { usePlayerStore } from 'src/stores/player';
import WorkspacePage from 'components/layout/WorkspacePage.vue';
import ActionButton from 'components/ActionButton.vue';
import FilterControl from 'components/FilterControl.vue';
import SampleDataBadge from 'components/SampleDataBadge.vue';
import SoundThumb from 'components/SoundThumb.vue';
import TrackTabs from 'components/TrackTabs.vue';
import PodiumCard from 'components/leaderboard/PodiumCard.vue';
import RankingTable from 'components/leaderboard/RankingTable.vue';
import ScoreExplanation from 'components/leaderboard/ScoreExplanation.vue';
import type { LeaderboardEntry, LeaderboardSort } from 'src/types/leaderboard';

// Leaderboard: models ranked on one track at a time. The track tabs are shared with
// the datasets page; the play buttons load the model's restoration of the track's
// preview clip into the global player.
const PODIUM_SIZE = 3;
const SORTS: LeaderboardSort[] = ['snrGain', 'listening'];

const $q = useQuasar();
const { t } = useI18n();
const datasets = useDatasetsStore();
const leaderboard = useLeaderboardStore();
const player = usePlayerStore();

const isDesktop = computed(() => $q.screen.gt.sm);
const tracks = computed(() => datasets.catalog?.tracks ?? []);
const trackId = computed(() => datasets.trackId);
const release = computed(() => leaderboard.board?.release ?? '');
const podium = computed(() => leaderboard.ranked.slice(0, PODIUM_SIZE));
const rest = computed(() => leaderboard.ranked.slice(PODIUM_SIZE));

const sortOptions = computed(() =>
    SORTS.map((value) => ({ value, label: t(`leaderboard.metrics.${value}`) })),
);
const sortLabel = computed(() =>
    t('leaderboard.sortBy', { metric: t(`leaderboard.metrics.${leaderboard.sort}`) }),
);

onMounted(async () => {
    if (!datasets.catalog) {
        await datasets.load();
    }
});

// Reload the ranking whenever the track changes (here or on the datasets page)
watch(
    trackId,
    async (id) => {
        if (id) {
            await leaderboard.load(id);
        }
    },
    { immediate: true },
);

function selectTrack(id: string) {
    datasets.selectTrack(id);
}

function setSort(value: string[] | string | null) {
    if (value === 'snrGain' || value === 'listening') {
        leaderboard.sort = value;
    }
}

function podiumRank(index: number): 1 | 2 | 3 {
    return (index + 1) as 1 | 2 | 3;
}

function play(entry: LeaderboardEntry) {
    const track = tracks.value.find((tr) => tr.id === trackId.value);
    return leaderboard.play(entry, track?.name ?? '');
}
</script>

<style scoped lang="scss">
// Typography, flex and simple spacing come from the global classes in the template.
// Only the gaps, the grids and the paddings that change in compact mode stay here.
.leaderboard-page {
    &__header {
        gap: var(--or-spacing-xs);
        padding: var(--or-spacing-xl) var(--or-spacing-lg) var(--or-spacing-md);
        border-bottom: 1px solid var(--or-border);

        &--compact {
            padding: var(--or-spacing-md-lg) var(--or-spacing-md) 0;
            border-bottom: 0;
        }
    }

    &__title-row {
        gap: var(--or-spacing-md);
    }

    &__filters {
        gap: var(--or-spacing-sm);
        padding: var(--or-spacing-sm) 0 var(--or-spacing-xs);

        &--compact {
            padding: var(--or-spacing-md-lg) 0;
        }
    }

    &__body {
        // Same 24px gap under the header line as on the sides
        padding: var(--or-spacing-lg);

        &--compact {
            padding: 0 var(--or-spacing-md) var(--or-spacing-lg);
        }
    }

    // Desktop: the three cards side by side. Compact: the winner above the two runners-up.
    &__podium {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--or-spacing-md);

        &--compact {
            grid-template-columns: minmax(0, 1fr);
            gap: var(--or-spacing-md-lg);
        }
    }

    &__runners-up {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--or-spacing-sm-md);
    }

    &__ranking {
        gap: var(--or-spacing-lg);
        padding-top: var(--or-spacing-xl);
    }

    &__body--compact &__ranking {
        gap: var(--or-spacing-xs);
        padding-top: var(--or-spacing-lg);
    }

    &__panel {
        gap: var(--or-spacing-md);
    }

    &__track {
        gap: var(--or-spacing-sm-md);
    }

    &__track-text {
        gap: var(--or-spacing-xxs);
    }
}
</style>
