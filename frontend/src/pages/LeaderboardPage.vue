<template>
    <workspace-page flush>
        <header
            class="leaderboard-page__header"
            :class="{ 'leaderboard-page__header--compact': !isDesktop }"
        >
            <p class="leaderboard-page__release">
                {{
                    isDesktop
                        ? t('leaderboard.release', { release: release })
                        : t('leaderboard.releaseShort', { release: release })
                }}
            </p>
            <div class="leaderboard-page__title-row">
                <h1 class="text-h1 q-my-none">{{ t('pages.leaderboard.title') }}</h1>
                <div v-if="isDesktop" class="leaderboard-page__filters">
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
                class="leaderboard-page__filters leaderboard-page__filters--compact"
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

            <section v-if="rest.length" class="leaderboard-page__ranking">
                <h2 class="leaderboard-page__ranking-title">{{ t('leaderboard.fullRanking') }}</h2>
                <ranking-table
                    :entries="rest"
                    :first-rank="podium.length + 1"
                    :compact="!isDesktop"
                    :loading="leaderboard.loading"
                />
            </section>
        </div>

        <p v-else-if="leaderboard.board" class="leaderboard-page__empty text-muted">
            {{ t('leaderboard.empty') }}
        </p>

        <template v-if="isDesktop" #aside>
            <div class="leaderboard-page__panel">
                <h2 class="leaderboard-page__panel-title">{{ t('leaderboard.nowPlaying') }}</h2>
                <div class="leaderboard-page__track">
                    <sound-thumb :active="leaderboard.nowPlaying !== null" />
                    <span class="leaderboard-page__track-text">
                        <span class="leaderboard-page__track-title">
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
.leaderboard-page {
    &__header {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
        padding: 30px 24px 16px;
        border-bottom: 1px solid var(--or-border);

        &--compact {
            align-items: stretch;
            padding: 20px 16px 0;
            border-bottom: 0;

            .leaderboard-page__release {
                color: var(--q-primary);
                font-size: 12px;
                font-weight: 700;
            }
        }
    }

    &__release {
        margin: 0;
        font-size: 13px;
        font-weight: 800;
        line-height: 1.25;
    }

    &__title-row {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        align-self: stretch;
        gap: 16px;
    }

    &__filters {
        display: flex;
        align-items: center;
        gap: 8px;
        padding-top: 8px;
        padding-bottom: 6px;

        &--compact {
            align-items: flex-start;
            padding: 20px 0;
        }
    }

    &__body {
        display: flex;
        flex-direction: column;
        // Same 24px gap under the header line as on the sides
        padding: 24px;

        &--compact {
            padding: 0 16px 24px;
        }
    }

    &__podium {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 16px;

        &--compact {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
    }

    &__runners-up {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
    }

    &__ranking {
        display: flex;
        flex-direction: column;
        gap: 24px;
        padding-top: 40px;
    }

    &__ranking-title {
        margin: 0;
        font-family: inherit;
        font-size: 20px;
        font-weight: 800;
        line-height: 1.25;
    }

    &__body--compact &__ranking {
        gap: 4px;
        padding-top: 26px;
    }

    &__body--compact &__ranking-title {
        font-size: 18px;
    }

    &__empty {
        margin: 24px;
    }

    &__panel {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-top: 6px;
    }

    &__panel-title {
        margin: 0;
        font-family: inherit;
        font-size: 16px;
        font-weight: 800;
        line-height: 1.25;
    }

    &__track {
        display: flex;
        align-items: center;
        gap: 12px;
        padding-top: 3px;
    }

    &__track-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
        font-size: 14px;
        line-height: 1.25;
    }

    &__track-title {
        overflow: hidden;
        font-size: 20px;
        font-weight: 800;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>
