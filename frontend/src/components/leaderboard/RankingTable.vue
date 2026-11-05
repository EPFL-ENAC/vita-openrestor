<template>
    <div
        class="ranking-table"
        :class="{ 'ranking-table--compact': compact, 'ranking-table--loading': loading }"
    >
        <div v-if="!compact" class="ranking-table__row ranking-table__head">
            <span class="ranking-table__rank">#</span>
            <span class="ranking-table__marker" />
            <span class="ranking-table__identity">{{ t('leaderboard.columns.model') }}</span>
            <span class="ranking-table__snr">{{ t('leaderboard.columns.snrGain') }}</span>
            <span class="ranking-table__listening">{{ t('leaderboard.columns.listening') }}</span>
        </div>

        <div class="ranking-table__rows">
            <router-link
                v-for="(entry, index) in entries"
                :key="entry.model.id"
                :to="{ name: 'leaderboard-model', params: { modelId: entry.model.id } }"
                class="ranking-table__row ranking-table__link"
            >
                <span class="ranking-table__rank">{{ firstRank + index }}</span>
                <span class="ranking-table__marker">
                    <model-avatar
                        :name="entry.model.name"
                        :mine="submissions.isMine(entry.model.id)"
                        :size="compact ? 32 : 36"
                    />
                </span>
                <span class="ranking-table__identity">
                    <span class="ranking-table__name">{{ entry.model.name }}</span>
                    <span class="ranking-table__lab text-muted">{{ entry.model.lab }}</span>
                </span>
                <span class="ranking-table__snr">{{ formatSnr(entry.snrGain) }}</span>
                <span v-if="!compact" class="ranking-table__listening">
                    {{ formatListening(entry.listening) }}
                </span>
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ModelAvatar from 'components/ModelAvatar.vue';
import { useSubmissionsStore } from 'src/stores/submissions';
import { formatListening, formatSnr } from './format';
import type { LeaderboardEntry } from 'src/types/leaderboard';

// Models below the podium (organism/Ranking/Full ranking).
// Desktop: table with SNR gain and listening columns; compact (mobile): list with SNR gain only.
defineProps<{
    entries: LeaderboardEntry[];
    // Rank of the first entry (the podium holds 1 to 3)
    firstRank: number;
    compact?: boolean;
    loading?: boolean;
}>();

const { t } = useI18n();
const submissions = useSubmissionsStore();
</script>

<style scoped lang="scss">
.ranking-table {
    display: flex;
    flex-direction: column;
    transition: opacity 0.15s;

    &--loading {
        opacity: 0.6;
    }

    &__row {
        display: flex;
        align-items: center;
        height: 56px;
        padding: 0 16px;
    }

    &__link {
        border-radius: var(--or-radius-md);
        color: var(--or-text);
        text-decoration: none;

        &:hover {
            background: var(--or-bg-surface);
        }
    }

    &__head {
        height: 30px;
        align-items: flex-start;
        border-bottom: 1px solid var(--or-border);
        color: var(--or-text-muted);
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;

        // Same left edge as the numbers below
        .ranking-table__rank {
            color: inherit;
            font-size: 12px;
        }
    }

    &__rows {
        padding-top: 8px;
    }

    &__rank {
        flex: 0 0 44px;
        color: var(--or-text-muted);
        font-size: 16px;
    }

    &__marker {
        display: flex;
        flex: 0 0 48px;
    }

    &__identity {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
        line-height: 1.25;
    }

    &__name {
        overflow: hidden;
        font-size: 14px;
        font-weight: 700;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &__lab {
        font-size: 13px;
    }

    &__snr {
        flex: 0 0 116px;
        font-size: 14px;
        font-weight: 600;
    }

    &__listening {
        flex: 0 0 96px;
        color: var(--or-text-muted);
        font-size: 14px;
    }

    &__head &__snr,
    &__head &__listening {
        color: inherit;
        font-size: 12px;
    }

    &--compact {
        .ranking-table__rows {
            padding-top: 0;
        }

        .ranking-table__row {
            gap: 12px;
            height: 60px;
            padding: 0 4px;
            border-bottom: 1px solid var(--or-bg-surface);
        }

        .ranking-table__rank {
            flex-basis: 20px;
            font-size: 15px;
        }

        .ranking-table__marker {
            flex-basis: auto;
        }

        .ranking-table__lab {
            font-size: 12px;
        }

        .ranking-table__snr {
            flex-basis: 78px;
            text-align: right;
        }
    }
}
</style>
