<template>
    <div
        class="ranking-table"
        :class="{ 'ranking-table--compact': compact, 'ranking-table--loading': loading }"
    >
        <div
            v-if="!compact"
            class="ranking-table__row ranking-table__head row no-wrap items-start text-overline text-muted"
        >
            <span class="ranking-table__rank">#</span>
            <span class="ranking-table__marker" />
            <span class="col">{{ t('leaderboard.columns.model') }}</span>
            <span class="ranking-table__snr">{{ t('leaderboard.columns.snrGain') }}</span>
            <span class="ranking-table__listening">{{ t('leaderboard.columns.listening') }}</span>
        </div>

        <div class="ranking-table__rows">
            <router-link
                v-for="(entry, index) in entries"
                :key="entry.model.id"
                :to="{ name: 'leaderboard-model', params: { modelId: entry.model.id } }"
                class="ranking-table__row ranking-table__link row no-wrap items-center"
            >
                <span class="ranking-table__rank text-subtitle1 text-muted">
                    {{ firstRank + index }}
                </span>
                <span class="ranking-table__marker flex">
                    <model-avatar
                        :name="entry.model.name"
                        :mine="submissions.isMine(entry.model.id)"
                        :size="compact ? 32 : 36"
                    />
                </span>
                <span class="ranking-table__identity col column no-wrap">
                    <span class="text-subtitle2 ellipsis">{{ entry.model.name }}</span>
                    <span class="text-body2 text-muted">{{ entry.model.lab }}</span>
                </span>
                <span class="ranking-table__snr text-subtitle2">
                    {{ formatSnr(entry.snrGain) }}
                </span>
                <span v-if="!compact" class="ranking-table__listening text-body1 text-muted">
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
// Typography and flex come from the global classes in the template.
// Only the column widths, row sizes and hover of this table stay here.
.ranking-table {
    transition: opacity 0.15s;

    &--loading {
        opacity: 0.6;
    }

    &__row {
        height: 56px;
        padding: 0 var(--or-spacing-md);
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
        border-bottom: 1px solid var(--or-border);
    }

    &__rows {
        padding-top: var(--or-spacing-sm);
    }

    &__rank {
        flex: 0 0 44px;
    }

    &__marker {
        flex: 0 0 48px;
    }

    &__identity {
        gap: var(--or-spacing-xxs);
    }

    &__snr {
        flex: 0 0 116px;
    }

    &__listening {
        flex: 0 0 96px;
    }

    &--compact {
        .ranking-table__rows {
            padding-top: 0;
        }

        .ranking-table__row {
            gap: var(--or-spacing-sm-md);
            height: 60px;
            padding: 0 var(--or-spacing-xs);
            border-bottom: 1px solid var(--or-bg-surface);
        }

        .ranking-table__rank {
            flex-basis: 20px;
        }

        .ranking-table__marker {
            flex-basis: auto;
        }

        .ranking-table__snr {
            flex-basis: 78px;
            text-align: right;
        }
    }
}
</style>
