<template>
    <div class="compare-panel column no-wrap">
        <div>
            <h2 class="text-h6 q-mt-none q-mb-xs">{{ t('leaderboard.compare.title') }}</h2>
            <p class="text-body2 text-muted q-ma-none">
                {{
                    t('leaderboard.compare.description', {
                        sample: sample.id,
                        degradation: sample.degradation,
                        severity: sample.severity,
                    })
                }}
            </p>
        </div>

        <button
            v-for="source in AUDIO_VERSIONS"
            :key="source"
            type="button"
            class="compare-panel__source plain-button column no-wrap text-left rounded-lg q-pa-sm-md"
            :class="[
                `compare-panel__source--${source}`,
                { 'compare-panel__source--current': loaded && player.version === source },
            ]"
            :aria-pressed="loaded && player.version === source"
            @click="emit('listen', source)"
        >
            <span class="text-body2 text-weight-bolder">{{ t(`player.versions.${source}`) }}</span>
            <audio-waveform
                :peaks="peaks"
                :progress="loaded ? player.progress : 0"
                :height="30"
                class="compare-panel__waveform"
            />
        </button>

        <section
            v-if="others.length"
            class="compare-panel__others column no-wrap q-pa-md rounded-lg bg-raised"
        >
            <h3 class="text-subtitle2 text-weight-bolder q-ma-none">
                {{ t('leaderboard.compare.others') }}
            </h3>
            <router-link
                v-for="other in others"
                :key="other.entry.model.id"
                :to="{
                    name: 'leaderboard-model',
                    params: { modelId: other.entry.model.id },
                    query: { sample: sample.id },
                }"
                class="compare-panel__other row no-wrap items-center text-body2"
            >
                <model-avatar
                    :name="other.entry.model.name"
                    :mine="submissions.isMine(other.entry.model.id)"
                    :size="28"
                />
                <span class="compare-panel__other-identity col column no-wrap">
                    <span class="text-subtitle2">{{ other.entry.model.name }}</span>
                    <span class="text-muted">{{
                        t('leaderboard.rank', { rank: other.rank })
                    }}</span>
                </span>
                <span class="text-muted">
                    {{ formatSnr(other.entry.sampleSnr[sample.id] ?? 0) }}
                </span>
            </router-link>
        </section>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { AUDIO_VERSIONS, usePlayerStore, type AudioVersion } from 'src/stores/player';
import AudioWaveform from 'components/player/AudioWaveform.vue';
import ModelAvatar from 'components/ModelAvatar.vue';
import { useSubmissionsStore } from 'src/stores/submissions';
import { formatSnr } from './format';
import type { LeaderboardEntry, TestSample } from 'src/types/leaderboard';

// Right panel of the model page (organism/Player/Side panel, Sample comparison):
// the selected sample as original, degraded and restored (click one to listen, at the
// same position), then how other models did on the same sample.
defineProps<{
    sample: TestSample;
    peaks: number[];
    // This model's restoration of this sample is in the player
    loaded: boolean;
    others: { entry: LeaderboardEntry; rank: number }[];
}>();

const emit = defineEmits<{ listen: [version: AudioVersion] }>();

const { t } = useI18n();
const submissions = useSubmissionsStore();
const player = usePlayerStore();
</script>

<style scoped lang="scss">
.compare-panel {
    gap: var(--or-spacing-md);
    padding-top: var(--or-spacing-xs);

    &__source {
        gap: var(--or-spacing-sm-md);
        color: var(--or-text-muted);

        &:hover,
        &--current {
            background: var(--or-bg-control);
            color: var(--or-text);
        }
    }

    // Each source keeps its colour; the played part stays red
    &__source--original :deep(.audio-waveform__bar) {
        background: var(--or-text);
    }

    &__source--degraded :deep(.audio-waveform__bar) {
        background: var(--or-waveform-dim);
    }

    &__source--restored :deep(.audio-waveform__bar) {
        background: var(--q-primary);
    }

    &__source :deep(.audio-waveform__bar--played) {
        background: var(--q-primary);
        opacity: 0.6;
    }

    &__others {
        gap: var(--or-spacing-sm-md);
    }

    &__other {
        gap: var(--or-spacing-sm-md);
        color: var(--or-text);
        text-decoration: none;
    }

    &__other-identity {
        gap: var(--or-spacing-xxs);
    }
}
</style>
