<template>
    <section
        class="submission-checks"
        :class="{
            'submission-checks--card': compact,
            'submission-checks--numbered': notStarted,
        }"
    >
        <h2 class="submission-checks__title">{{ t('submission.checks.title') }}</h2>
        <p v-if="!compact" class="submission-checks__description">
            {{ t('submission.checks.description') }}
        </p>

        <ol class="submission-checks__list">
            <li v-for="(step, index) in steps" :key="step.key" class="submission-checks__step">
                <span
                    v-if="step.state === 'failed'"
                    class="submission-checks__failed"
                    role="img"
                    :aria-label="t('submission.checks.states.failed')"
                >
                    <q-icon name="close" size="18px" />
                </span>
                <span v-else-if="!step.icon" class="submission-checks__number">{{
                    index + 1
                }}</span>
                <img
                    v-else
                    :src="step.icon"
                    width="28"
                    height="28"
                    :alt="t(`submission.checks.states.${step.state}`)"
                    class="submission-checks__status"
                />
                <div class="submission-checks__text">
                    <span class="submission-checks__name">
                        {{ t(`submission.checks.steps.${step.key}.title`) }}
                    </span>
                    <span class="submission-checks__detail">{{ detailOf(step) }}</span>
                    <ul v-if="step.subSteps.length > 0" class="submission-checks__sub-steps">
                        <li v-for="subStep in step.subSteps" :key="subStep">
                            <img :src="bulletIcon" width="4" height="4" alt="" />
                            {{ t(`submission.checks.steps.${step.key}.subSteps.${subStep}`) }}
                        </li>
                    </ul>
                </div>
            </li>
        </ol>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import passedIcon from 'assets/icons/check-passed-28.svg';
import runningIcon from 'assets/icons/check-running-28.svg';
import queuedIcon from 'assets/icons/check-queued-28.svg';
import bulletIcon from 'assets/icons/bullet-4.svg';
import type { SubmissionCheck, SubmissionPhase } from 'src/types/submissions';

// The four checks a submission goes through, in order (organism/Submission/Checks).
// Before the run they are numbered; once it starts, each shows passed, running or queued.
// When a run stopped at a failed check, that check shows the reason and later ones did not run.
// Desktop: the right-hand panel. Mobile: a card.
const props = defineProps<{
    phase: SubmissionPhase;
    compact?: boolean;
    // The check the last run stopped at, with the reason
    failure?: { check: SubmissionCheck; message: string } | null;
}>();

const { t } = useI18n();

type CheckState = 'notStarted' | 'queued' | 'running' | 'passed' | 'failed' | 'notRun';

const STATUS_ICONS: Record<'queued' | 'running' | 'passed', string> = {
    passed: passedIcon,
    running: runningIcon,
    queued: queuedIcon,
};

const CHECKS = [
    { key: 'imageBuild', subSteps: [] },
    { key: 'metadata', subSteps: [] },
    { key: 'dockerfile', subSteps: ['envVars', 'llmReview'] },
    { key: 'scoring', subSteps: [] },
] as const;

// While checks run, the mock run is on the second check
const RUNNING_INDEX = 1;

const notStarted = computed(() => props.phase === 'draft');

function stateOf(index: number): CheckState {
    switch (props.phase) {
        case 'draft':
            return 'notStarted';
        case 'checks_running': {
            const failedIndex = props.failure
                ? CHECKS.findIndex((c) => c.key === props.failure?.check)
                : -1;
            if (failedIndex >= 0) {
                return index < failedIndex ? 'passed' : index === failedIndex ? 'failed' : 'notRun';
            }
            return index < RUNNING_INDEX
                ? 'passed'
                : index === RUNNING_INDEX
                  ? 'running'
                  : 'queued';
        }
        default:
            return 'passed';
    }
}

const steps = computed(() =>
    CHECKS.map((check, index) => {
        const state = stateOf(index);
        const icon =
            state === 'queued' || state === 'running' || state === 'passed'
                ? STATUS_ICONS[state]
                : null;
        return { ...check, state, icon };
    }),
);

function detailOf(step: { key: string; state: CheckState }): string {
    if (step.state === 'failed') {
        return t('submission.checks.failed', { message: props.failure?.message ?? '' });
    }
    if (step.state === 'notRun') {
        return t('submission.checks.notRun');
    }
    return t(`submission.checks.steps.${step.key}.${step.state}`);
}
</script>

<style scoped lang="scss">
.submission-checks {
    display: flex;
    flex-direction: column;

    &__title {
        margin: 0;
        font-family: inherit;
        font-size: 16px;
        font-weight: 800;
        line-height: 1.25;
    }

    &__description {
        margin: 0;
        color: var(--or-text-muted);
        font-size: 13px;
        line-height: 1.4;
    }

    &__list {
        display: flex;
        flex-direction: column;
        gap: 24px;
        margin: 28px 0 0;
        padding: 0;
        list-style: none;
    }

    &__step {
        display: flex;
        align-items: flex-start;
        gap: 12px;
    }

    &__status {
        display: block;
        flex-shrink: 0;
    }

    &__number {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border: 2px solid var(--or-waveform-idle);
        border-radius: 50%;
        color: var(--or-text-muted);
        font-size: 14px;
        font-weight: 700;
    }

    &__failed {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border: 2px solid var(--q-negative);
        border-radius: 50%;
        color: var(--q-negative);
    }

    &__text {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        gap: 3px;
        min-width: 0;
    }

    &__name {
        font-size: 14px;
        font-weight: 800;
        line-height: 1.25;
    }

    &__detail {
        color: var(--or-text-muted);
        font-size: 13px;
        line-height: 1.4;
    }

    &__sub-steps {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin: 0;
        padding: 6px 0 0;
        list-style: none;

        li {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--or-text-muted);
            font-size: 12px;
            line-height: 1.4;
        }
    }

    // Mobile: a card above the Dockerfile, without the description
    &--card {
        padding: 16px;
        border-radius: var(--or-radius-lg);
        background: var(--or-bg-raised);

        .submission-checks__title {
            font-size: 14px;
        }

        .submission-checks__list {
            gap: 22px;
            margin-top: 16px;
        }
    }

    // Before the run: numbered rows separated by lines
    &--numbered {
        .submission-checks__description {
            margin: 6px 0 18px;
        }

        .submission-checks__list {
            gap: 0;
            margin-top: 0;
        }

        .submission-checks__step {
            padding: 12px 0 15px;
            border-top: 1px solid var(--or-border);
        }

        .submission-checks__text {
            gap: 1px;
        }
    }
}
</style>
