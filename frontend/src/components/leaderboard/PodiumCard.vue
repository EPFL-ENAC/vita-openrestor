<template>
    <article
        class="podium-card"
        :class="[`podium-card--${layout}`, { 'podium-card--winner': rank === 1 }]"
        role="link"
        tabindex="0"
        :aria-label="t('leaderboard.openModel', { model: entry.model.name })"
        @click="openModel"
        @keydown.enter.self="openModel"
    >
        <div class="podium-card__rank">
            <span class="podium-card__number">{{ rank }}</span>
            <span class="podium-card__place">{{ t(`leaderboard.places.${rank}`) }}</span>
            <model-avatar
                class="podium-card__avatar"
                :name="entry.model.name"
                :mine="submissions.isMine(entry.model.id)"
                :size="layout === 'compact' ? 28 : 36"
            />
        </div>

        <div class="podium-card__identity">
            <h3 class="podium-card__name">{{ entry.model.name }}</h3>
            <span v-if="layout !== 'compact'" class="podium-card__lab text-muted">
                {{ entry.model.lab }}
            </span>
        </div>

        <div class="podium-card__divider" />

        <div class="podium-card__summary">
            <template v-if="layout === 'compact'">
                <span class="podium-card__metric podium-card__metric--fill">
                    <span class="podium-card__value">{{ formatSnr(entry.snrGain) }}</span>
                    <span class="podium-card__label">
                        {{
                            t('leaderboard.listeningShort', {
                                value: formatListening(entry.listening),
                            })
                        }}
                    </span>
                </span>
            </template>
            <template v-else>
                <span class="podium-card__metric podium-card__metric--snr">
                    <span class="podium-card__value">{{ formatSnr(entry.snrGain) }}</span>
                    <span class="podium-card__label">{{ t('leaderboard.metrics.snrGain') }}</span>
                </span>
                <span class="podium-card__metric podium-card__metric--listening">
                    <span class="podium-card__value">{{ formatListening(entry.listening) }}</span>
                    <span class="podium-card__label">{{ t('leaderboard.metrics.listening') }}</span>
                </span>
            </template>
            <button
                type="button"
                class="podium-card__play"
                :aria-label="
                    playing
                        ? t('leaderboard.pauseModel', { model: entry.model.name })
                        : t('leaderboard.playModel', { model: entry.model.name })
                "
                :aria-pressed="playing"
                @click.stop="emit('play')"
            >
                <img :src="playIcon" :width="playSize" :height="playSize" alt="" />
            </button>
        </div>
    </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import ModelAvatar from 'components/ModelAvatar.vue';
import { useSubmissionsStore } from 'src/stores/submissions';
import { formatListening, formatSnr } from './format';
import playAccent48 from 'assets/icons/play-accent-48.svg';
import playNeutral48 from 'assets/icons/play-neutral-48.svg';
import playNeutral44 from 'assets/icons/play-neutral-44.svg';
import pauseAccent48 from 'assets/icons/pause-accent-48.svg';
import pauseNeutral48 from 'assets/icons/pause-neutral-48.svg';
import pauseNeutral44 from 'assets/icons/pause-neutral-44.svg';
import type { LeaderboardEntry } from 'src/types/leaderboard';

// One of the top three models (molecule/Podium/Card).
// desktop: three cards in a row; winner (mobile): full width; compact (mobile): runners-up side by side.
const props = defineProps<{
    entry: LeaderboardEntry;
    rank: 1 | 2 | 3;
    layout: 'desktop' | 'winner' | 'compact';
    playing: boolean;
}>();

const emit = defineEmits<{ play: [] }>();

const { t } = useI18n();
const submissions = useSubmissionsStore();
const router = useRouter();

// The card opens the model page (its test samples); the play button only plays the preview
function openModel() {
    return router.push({ name: 'leaderboard-model', params: { modelId: props.entry.model.id } });
}

const playSize = computed(() => (props.layout === 'compact' ? 44 : 48));
// Pause while this model's preview plays, as on the global player
const playIcon = computed(() => {
    if (props.layout === 'compact') {
        return props.playing ? pauseNeutral44 : playNeutral44;
    }
    if (props.rank === 1) {
        return props.playing ? pauseAccent48 : playAccent48;
    }
    return props.playing ? pauseNeutral48 : playNeutral48;
});
</script>

<style scoped lang="scss">
.podium-card {
    display: flex;
    flex-direction: column;
    min-width: 0;
    border: 1px solid var(--or-border);
    border-radius: var(--or-radius-lg);
    background: var(--or-bg-surface);
    cursor: pointer;

    &--winner {
        border-color: var(--q-primary);
        background: var(--or-bg-winner);

        .podium-card__number,
        .podium-card__place {
            color: var(--q-primary);
        }
    }

    &__rank {
        display: flex;
        align-items: baseline;
        gap: 12px;
    }

    &__number {
        font-weight: 900;
        line-height: 1;
    }

    &__place {
        color: var(--or-text-muted);
        font-weight: 700;
        line-height: 1.25;
    }

    &__avatar {
        align-self: center;
        margin-left: auto;
    }

    &__identity {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
    }

    &__name {
        margin: 0;
        overflow: hidden;
        font-size: 24px;
        font-weight: 900;
        line-height: 1.25;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &__lab {
        font-size: 13px;
    }

    &__divider {
        height: 1px;
        background: var(--or-border);
    }

    &__summary {
        display: flex;
        flex: 1 1 auto;
        align-items: center;
        gap: 8px;
    }

    &__metric {
        display: flex;
        flex-direction: column;
        gap: 2px;
        line-height: 1.25;
        white-space: nowrap;

        &--snr {
            width: 90px;
        }

        &--listening {
            width: 80px;
        }

        &--fill {
            flex: 1 1 0;
            min-width: 0;
        }
    }

    &__value {
        font-size: 18px;
        font-weight: 800;
    }

    &__label {
        color: var(--or-text-muted);
        font-size: 12px;
    }

    &__play {
        display: flex;
        flex-shrink: 0;
        margin-left: auto;
        padding: 0;
        border: 0;
        border-radius: 50%;
        background: none;
        cursor: pointer;
    }

    // Desktop: three equal cards
    &--desktop {
        height: 248px;
        padding: 24px;

        .podium-card__number {
            font-size: 40px;
        }

        .podium-card__place {
            font-size: 13px;
        }

        .podium-card__identity {
            padding: 15px 0 20px;
        }

        .podium-card__summary {
            padding-top: 20px;
        }

        &.podium-card--winner .podium-card__rank {
            gap: 18px;
        }
    }

    // Mobile winner: full width
    &--winner {
        &.podium-card--winner:not(.podium-card--desktop) {
            height: 226px;
            padding: 20px;

            .podium-card__rank {
                gap: 16px;
            }

            .podium-card__number {
                font-size: 36px;
            }

            .podium-card__place {
                font-size: 13px;
            }

            .podium-card__identity {
                padding: 9px 0 18px;
            }

            .podium-card__summary {
                gap: 16px;
                padding-top: 14px;
            }
        }
    }

    // Mobile runners-up: two small cards side by side
    &--compact {
        height: 176px;
        padding: 16px;

        .podium-card__number {
            font-size: 28px;
        }

        .podium-card__place {
            font-size: 12px;
        }

        .podium-card__identity {
            padding: 7px 0 12px;
        }

        .podium-card__name {
            font-size: 17px;
        }

        .podium-card__value {
            font-size: 16px;
        }

        .podium-card__summary {
            padding-top: 8px;
        }
    }
}
</style>
