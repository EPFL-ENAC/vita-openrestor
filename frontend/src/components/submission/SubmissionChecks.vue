<template>
    <section
        class="submission-checks"
        :class="{
            'submission-checks--card': compact,
            'q-pa-md rounded-lg bg-raised': compact,
            'submission-checks--numbered': notStarted,
        }"
    >
        <h2 class="text-h6 q-my-none">{{ t('submission.checks.title') }}</h2>
        <p v-if="!compact" class="submission-checks__description text-body2 text-muted q-my-none">
            {{ t('submission.checks.description') }}
        </p>

        <ol class="submission-checks__list column no-wrap q-pa-none">
            <li
                v-for="(step, index) in steps"
                :key="step.key"
                class="submission-checks__step row no-wrap items-start"
            >
                <span
                    v-if="step.state === 'failed'"
                    class="submission-checks__failed row no-wrap items-center justify-center text-negative"
                    role="img"
                    :aria-label="t('submission.checks.states.failed')"
                >
                    <q-icon :name="matClose" size="18px" />
                </span>
                <span
                    v-else-if="!step.icon"
                    class="submission-checks__number row no-wrap items-center justify-center text-subtitle2 text-muted"
                >
                    {{ index + 1 }}
                </span>
                <img
                    v-else
                    :src="step.icon"
                    width="28"
                    height="28"
                    :alt="t(`submission.checks.states.${step.state}`)"
                    class="col-auto"
                />
                <div class="submission-checks__text col column no-wrap">
                    <span class="text-subtitle2 text-weight-bolder">
                        {{ t(`submission.checks.steps.${step.key}.title`) }}
                    </span>
                    <span class="text-body2 text-muted">{{ detailOf(step) }}</span>
                    <ul
                        v-if="step.subSteps.length > 0"
                        class="submission-checks__sub-steps column no-wrap q-ma-none"
                    >
                        <li
                            v-for="subStep in step.subSteps"
                            :key="subStep"
                            class="submission-checks__sub-step row no-wrap items-center text-caption text-muted"
                        >
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
import { matClose } from '@quasar/extras/material-icons';
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
// Typography, flex and the mobile card look come from the global classes in the template.
// The list spacing of each variant and the round step badges stay here.
.submission-checks {
    &__list {
        gap: var(--or-spacing-lg);
        margin: var(--or-spacing-lg) 0 0;
        list-style: none;
    }

    &__step {
        gap: var(--or-spacing-sm-md);
    }

    // Round 28px badge: the step number, or a cross for the failed check.
    // Not `col-auto`: its width: auto would compete with the width here.
    &__number,
    &__failed {
        flex-shrink: 0;
        width: 28px;
        height: 28px;
        border: 2px solid var(--or-waveform-idle);
        border-radius: 50%;
    }

    &__failed {
        border-color: var(--q-negative);
    }

    &__text {
        gap: var(--or-spacing-xxs);
    }

    &__sub-steps {
        gap: var(--or-spacing-xs);
        padding: var(--or-spacing-xs) 0 0;
        list-style: none;
    }

    &__sub-step {
        gap: var(--or-spacing-sm);
    }

    // Mobile: a card above the Dockerfile, without the description
    &--card .submission-checks__list {
        gap: var(--or-spacing-md-lg);
        margin-top: var(--or-spacing-md);
    }

    // Before the run: numbered rows separated by lines. After --card, so it wins on mobile too.
    &--numbered {
        .submission-checks__description {
            margin: var(--or-spacing-xs) 0 var(--or-spacing-md);
        }

        .submission-checks__list {
            gap: 0;
            margin-top: 0;
        }

        .submission-checks__step {
            padding: var(--or-spacing-sm-md) 0 var(--or-spacing-md);
            border-top: 1px solid var(--or-border);
        }
    }
}
</style>
