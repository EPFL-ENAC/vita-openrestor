<template>
    <article
        class="podium-card column no-wrap cursor-pointer"
        :class="[`podium-card--${layout}`, { 'podium-card--winner': rank === 1 }]"
        role="link"
        tabindex="0"
        :aria-label="t('leaderboard.openModel', { model: entry.model.name })"
        @click="openModel"
        @keydown.enter.self="openModel"
    >
        <div class="podium-card__rank row no-wrap items-baseline">
            <span class="podium-card__number text-h2">{{ rank }}</span>
            <span class="podium-card__place text-body2 text-weight-bold">
                {{ t(`leaderboard.places.${rank}`) }}
            </span>
            <model-avatar
                class="self-center q-ml-auto"
                :name="entry.model.name"
                :mine="submissions.isMine(entry.model.id)"
                :size="layout === 'compact' ? 28 : 36"
            />
        </div>

        <div class="podium-card__identity column no-wrap">
            <!-- Smaller name on the narrow compact card -->
            <h3
                class="podium-card__name ellipsis q-my-none"
                :class="layout === 'compact' ? 'text-h6' : 'text-h2'"
            >
                {{ entry.model.name }}
            </h3>
            <span v-if="layout !== 'compact'" class="text-body2 text-muted">
                {{ entry.model.lab }}
            </span>
        </div>

        <div class="podium-card__divider" />

        <div class="podium-card__summary col row no-wrap items-center">
            <template v-if="layout === 'compact'">
                <span class="podium-card__metric col column no-wrap text-no-wrap">
                    <span class="text-h6">{{ formatSnr(entry.snrGain) }}</span>
                    <span class="text-caption text-muted">
                        {{
                            t('leaderboard.listeningShort', {
                                value: formatListening(entry.listening),
                            })
                        }}
                    </span>
                </span>
            </template>
            <template v-else>
                <span
                    class="podium-card__metric podium-card__metric--snr column no-wrap text-no-wrap"
                >
                    <span class="text-h5">{{ formatSnr(entry.snrGain) }}</span>
                    <span class="text-caption text-muted">
                        {{ t('leaderboard.metrics.snrGain') }}
                    </span>
                </span>
                <span
                    class="podium-card__metric podium-card__metric--listening column no-wrap text-no-wrap"
                >
                    <span class="text-h5">{{ formatListening(entry.listening) }}</span>
                    <span class="text-caption text-muted">
                        {{ t('leaderboard.metrics.listening') }}
                    </span>
                </span>
            </template>
            <button
                type="button"
                class="podium-card__play plain-button flex col-auto q-ml-auto"
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
// Typography and flex come from the global classes in the template.
// Only the card frame, the winner colors and the per-layout sizes and spacing stay here.
.podium-card {
    min-width: 0;
    border: 1px solid var(--or-border);
    border-radius: var(--or-radius-lg);
    background: var(--or-bg-surface);

    &--winner {
        border-color: var(--q-primary);
        background: var(--or-bg-winner);

        .podium-card__number,
        .podium-card__place {
            color: var(--q-primary);
        }
    }

    &__rank {
        gap: var(--or-spacing-sm-md);
    }

    // Not the text-muted class: its !important would beat the winner's red above
    &__place {
        color: var(--or-text-muted);
    }

    &__identity {
        gap: var(--or-spacing-xs);
    }

    &__divider {
        height: 1px;
        background: var(--or-border);
    }

    &__summary {
        gap: var(--or-spacing-sm);
    }

    &__metric {
        gap: var(--or-spacing-xxs);

        &--snr {
            width: 90px;
        }

        &--listening {
            width: 80px;
        }
    }

    &__play {
        border-radius: 50%;
    }

    // Desktop: three equal cards
    &--desktop {
        height: 248px;
        padding: var(--or-spacing-lg);

        // Display number: no text class this size (text-h2 gives the weight)
        .podium-card__number {
            font-size: 32px;
        }

        .podium-card__identity {
            padding: var(--or-spacing-md) 0 var(--or-spacing-md-lg);
        }

        .podium-card__summary {
            padding-top: var(--or-spacing-md-lg);
        }

        &.podium-card--winner .podium-card__rank {
            gap: var(--or-spacing-md);
        }
    }

    // Mobile winner: full width
    &--winner {
        &.podium-card--winner:not(.podium-card--desktop) {
            height: 226px;
            padding: var(--or-spacing-md-lg);

            .podium-card__rank {
                gap: var(--or-spacing-md);
            }

            .podium-card__number {
                font-size: 32px;
            }

            .podium-card__identity {
                padding: var(--or-spacing-sm) 0 var(--or-spacing-md);
            }

            .podium-card__summary {
                gap: var(--or-spacing-md);
                padding-top: var(--or-spacing-sm-md);
            }
        }
    }

    // Mobile runners-up: two small cards side by side
    &--compact {
        height: 176px;
        padding: var(--or-spacing-md);

        .podium-card__identity {
            padding: var(--or-spacing-sm) 0 var(--or-spacing-sm-md);
        }

        .podium-card__summary {
            padding-top: var(--or-spacing-sm);
        }
    }
}
</style>
