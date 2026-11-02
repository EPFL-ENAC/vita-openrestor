<template>
    <div class="submission-progress" :class="{ 'submission-progress--compact': compact }">
        <div class="submission-progress__bars" aria-hidden="true">
            <span
                v-for="stage in stages"
                :key="stage.key"
                class="submission-progress__bar"
                :class="`submission-progress__bar--${stage.state}`"
            />
        </div>

        <p
            v-if="compact"
            class="submission-progress__summary"
            :class="`submission-progress__label--${activeState}`"
        >
            {{
                t('submission.stageOf', {
                    n: activeIndex + 1,
                    total: stages.length,
                    stage: summary,
                })
            }}
        </p>
        <ol v-else class="submission-progress__labels">
            <li
                v-for="stage in stages"
                :key="stage.key"
                class="submission-progress__label"
                :class="`submission-progress__label--${stage.state}`"
                :aria-current="
                    stage.state === 'done' || stage.state === 'todo' ? undefined : 'step'
                "
            >
                {{ t(`submission.stages.${stage.key}`) }}
            </li>
        </ol>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { SUBMISSION_PHASES, type SubmissionPhase } from 'src/types/submissions';

// Five-stage submission progress (molecule/Submission/Progress): finished stages are white,
// the current one red (green once approved), later ones grey. Desktop labels every stage;
// mobile shows one "Stage n of 5" line.
const props = defineProps<{
    phase: SubmissionPhase;
    // The checks stage stopped at a failed check
    failed?: boolean;
    // Mobile: one summary line instead of the five labels
    compact?: boolean;
    // Text after "Stage n of 5 ·" on mobile (the current status)
    summary: string;
}>();

const { t } = useI18n();

type StageState = 'done' | 'active' | 'approved' | 'todo';

const activeIndex = computed(() => SUBMISSION_PHASES.indexOf(props.phase));
const activeState = computed<StageState>(() =>
    props.phase === 'approved' ? 'approved' : 'active',
);

// The label of the current stage says what is happening in it
const stages = computed(() =>
    SUBMISSION_PHASES.map((phase, index) => {
        const state: StageState =
            index < activeIndex.value
                ? 'done'
                : index === activeIndex.value
                  ? activeState.value
                  : 'todo';
        const key =
            phase === 'checks_running'
                ? state === 'active'
                    ? props.failed
                        ? 'checksFailed'
                        : 'checksRunning'
                    : 'checks'
                : phase === 'approved'
                  ? state === 'approved'
                      ? 'approved'
                      : 'decision'
                  : phase;
        return { key, state };
    }),
);
</script>

<style scoped lang="scss">
.submission-progress {
    display: flex;
    flex-direction: column;
    gap: 9px;

    &__bars,
    &__labels {
        display: flex;
        gap: 4px;
    }

    &__bar {
        flex: 1 1 0;
        height: 3px;
        background: var(--or-progress-track);

        &--done {
            background: var(--or-text);
        }

        &--active {
            background: var(--q-primary);
        }

        &--approved {
            background: var(--q-positive);
        }
    }

    &__labels {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    &__label {
        flex: 1 1 0;
        min-width: 0;
        font-size: 12px;
        font-weight: 700;

        &--todo {
            color: var(--or-text-muted);
            font-weight: 400;
        }

        &--active {
            color: var(--q-primary);
        }

        &--approved {
            color: var(--q-positive);
        }
    }

    &__summary {
        margin: 0;
        font-size: 14px;
        font-weight: 700;
    }
}
</style>
