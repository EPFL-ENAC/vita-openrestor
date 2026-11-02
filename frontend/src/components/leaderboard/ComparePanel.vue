<template>
    <div class="compare-panel">
        <div class="compare-panel__heading">
            <h2 class="compare-panel__title">{{ t('leaderboard.compare.title') }}</h2>
            <p class="text-muted">
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
            class="compare-panel__source"
            :class="[
                `compare-panel__source--${source}`,
                { 'compare-panel__source--current': loaded && player.version === source },
            ]"
            :aria-pressed="loaded && player.version === source"
            @click="emit('listen', source)"
        >
            <span class="compare-panel__source-label">{{ t(`player.versions.${source}`) }}</span>
            <audio-waveform
                :peaks="peaks"
                :progress="loaded ? player.progress : 0"
                :height="30"
                class="compare-panel__waveform"
            />
        </button>

        <section v-if="others.length" class="compare-panel__others">
            <h3 class="compare-panel__others-title">{{ t('leaderboard.compare.others') }}</h3>
            <router-link
                v-for="other in others"
                :key="other.entry.model.id"
                :to="{
                    name: 'leaderboard-model',
                    params: { modelId: other.entry.model.id },
                    query: { sample: sample.id },
                }"
                class="compare-panel__other"
            >
                <model-avatar
                    :name="other.entry.model.name"
                    :mine="submissions.isMine(other.entry.model.id)"
                    :size="28"
                />
                <span class="compare-panel__other-identity">
                    <span class="compare-panel__other-name">{{ other.entry.model.name }}</span>
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
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 6px;

    p {
        margin: 0;
        font-size: 13px;
        line-height: 1.4;
    }

    &__heading {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    &__title {
        margin: 0;
        font-family: inherit;
        font-size: 16px;
        font-weight: 800;
    }

    &__source {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 12px;
        border: 0;
        border-radius: var(--or-radius-lg);
        background: transparent;
        color: var(--or-text-muted);
        font: inherit;
        text-align: left;
        cursor: pointer;

        &:hover,
        &--current {
            background: var(--or-bg-control);
            color: var(--or-text);
        }
    }

    &__source-label {
        font-size: 13px;
        font-weight: 800;
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
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 16px;
        border-radius: var(--or-radius-lg);
        background: var(--or-bg-raised);
    }

    &__others-title {
        margin: 0;
        font-family: inherit;
        font-size: 14px;
        font-weight: 800;
    }

    &__other {
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--or-text);
        font-size: 13px;
        text-decoration: none;
    }

    &__other-identity {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
    }

    &__other-name {
        font-size: 14px;
        font-weight: 700;
    }
}
</style>
