<template>
    <workspace-page flush>
        <header
            class="submission-page__heading column no-wrap"
            :class="{
                'submission-page__heading--compact': !isDesktop,
                'submission-page__heading--draft': isDraft,
                'justify-end': isDraft,
            }"
        >
            <back-button
                v-if="!isDraft"
                :to="{ name: 'leaderboard' }"
                :label="t('pages.leaderboard.title')"
            />
            <div
                class="submission-page__identity row items-center"
                :class="{ 'no-wrap': !isDesktop }"
            >
                <model-avatar v-if="!isDraft" :name="title" mine :size="isDesktop ? 88 : 56" />
                <div class="submission-page__identity-text column no-wrap">
                    <p
                        class="q-my-none"
                        :class="
                            isDesktop
                                ? 'text-body2 text-weight-bolder'
                                : 'text-caption text-weight-bold text-primary'
                        "
                    >
                        {{ eyebrow }}
                    </p>
                    <h1 class="text-h1 ellipsis q-my-none">{{ title }}</h1>
                    <p
                        v-if="isDesktop"
                        class="text-body2 text-weight-bold q-my-none"
                        :class="{
                            'text-positive': phase === 'approved',
                            'text-negative': failed,
                            'text-muted': isDraft,
                        }"
                    >
                        {{ statusText }}
                    </p>
                </div>
                <div
                    v-if="isDesktop"
                    class="submission-page__actions row no-wrap col-auto q-ml-auto"
                >
                    <action-button
                        v-for="action in actions"
                        :key="action.key"
                        :label="action.label"
                        :tone="action.tone"
                        :disable="action.disabled"
                        @click="action.run"
                    />
                </div>
            </div>
        </header>

        <div
            class="submission-page__body column no-wrap"
            :class="{ 'submission-page__body--compact': !isDesktop }"
        >
            <!-- Desktop: more room under the progress, as between the header line and it -->
            <submission-progress
                :phase="phase"
                :failed="failed"
                :compact="!isDesktop"
                :summary="statusText"
                :class="{ 'q-mb-sm': isDesktop }"
            />

            <template v-if="!isDesktop">
                <submission-checks :phase="phase" :failure="failure" compact />
                <score-summary
                    v-if="hasScores"
                    :snr-gain="detail?.snrGain ?? null"
                    :listening="detail?.listening ?? null"
                    compact
                />
            </template>

            <dockerfile-card
                :file="dockerfile"
                :locked="!isDraft"
                :compact="!isDesktop"
                :release="RELEASE"
                @select="selectDockerfile"
            />
            <model-card-form v-model="card" :locked="!isDraft" :compact="!isDesktop" />

            <template v-if="!isDesktop">
                <feedback-notice v-bind="notice" />
                <div
                    class="submission-page__mobile-actions row"
                    :class="{ 'submission-page__mobile-actions--row': isDraft }"
                >
                    <action-button
                        v-for="action in actions"
                        :key="action.key"
                        :label="action.label"
                        :tone="action.tone"
                        :disable="action.disabled"
                        :block="action.tone === 'accent' && !isDraft"
                        class="submission-page__mobile-action"
                        @click="action.run"
                    />
                </div>
            </template>
        </div>

        <template v-if="isDesktop" #aside>
            <div class="submission-page__aside column no-wrap">
                <submission-checks :phase="phase" :failure="failure" />
                <score-summary
                    v-if="hasScores"
                    :snr-gain="detail?.snrGain ?? null"
                    :listening="detail?.listening ?? null"
                    class="q-mt-md"
                />
                <!-- Pushed to the bottom; keeps some space when the panel is full -->
                <div class="q-mt-auto q-pt-lg">
                    <feedback-notice v-bind="notice" />
                </div>
            </div>
        </template>

        <phase-debug-toggle
            :model-value="phase"
            :above-nav="!isDesktop"
            @update:model-value="setPhase"
        />
    </workspace-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import WorkspacePage from 'components/layout/WorkspacePage.vue';
import ActionButton from 'components/ActionButton.vue';
import BackButton from 'components/BackButton.vue';
import ModelAvatar from 'components/ModelAvatar.vue';
import SubmissionProgress from 'components/submission/SubmissionProgress.vue';
import SubmissionChecks from 'components/submission/SubmissionChecks.vue';
import DockerfileCard from 'components/submission/DockerfileCard.vue';
import ModelCardForm from 'components/submission/ModelCardForm.vue';
import ScoreSummary from 'components/submission/ScoreSummary.vue';
import FeedbackNotice from 'components/submission/FeedbackNotice.vue';
import PhaseDebugToggle from 'components/submission/PhaseDebugToggle.vue';
import { useSubmissionsStore } from 'src/stores/submissions';
import {
    SUBMISSION_PHASES,
    type ModelCardFields,
    type SubmissionDetail,
    type SubmissionPhase,
    type SubmissionStatus,
    type SubmittedFile,
} from 'src/types/submissions';

// Submission page: one attempt to get a model version scored, through five stages
// (draft → checks → submitted → in review → decision). A draft is editable; from the
// checks on, the Dockerfile and model card are locked.
//
// One model has one submission: there are no versions. /submissions/new starts a new
// model. A run that stopped at a failed check shows that check, and "Fix and resubmit"
// brings the submission back to an editable draft.
//
// The stage is in ?step= so a state can be linked to; the debug toggle sets it.
// Without it, a new submission starts as a draft and an existing one follows its status.

// Every submission is scored on all tracks of this release
const RELEASE = 'v0.1';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const { t, d } = useI18n();
const submissions = useSubmissionsStore();

const isDesktop = computed(() => $q.screen.gt.sm);
const submissionId = computed(() => (route.name === 'submission' ? String(route.params.id) : null));

const detail = ref<SubmissionDetail | null>(null);
const card = ref<ModelCardFields>(emptyCard());
const dockerfile = ref<SubmittedFile | null>(null);
const savedRecently = ref(false);

function emptyCard(): ModelCardFields {
    return {
        name: '',
        authors: '',
        architecture: '',
        parameters: '',
        trainingData: '',
        codeRepo: '',
        dataRepo: '',
        paper: '',
        licence: '',
    };
}

// Failed checks and rejection have no design yet: shown as the stage they happen in
const PHASE_OF_STATUS: Record<SubmissionStatus, SubmissionPhase> = {
    draft: 'draft',
    checks_running: 'checks_running',
    checks_failed: 'checks_running',
    submitted: 'submitted',
    in_review: 'in_review',
    approved: 'approved',
    rejected: 'in_review',
};

// The submission shown; null for a new one
const found = computed(() => (submissionId.value ? submissions.find(submissionId.value) : null));

const statusPhase = computed<SubmissionPhase>(() =>
    found.value ? PHASE_OF_STATUS[found.value.status] : 'draft',
);

const phase = computed<SubmissionPhase>(() => {
    const step = route.query.step;
    return SUBMISSION_PHASES.find((p) => p === step) ?? statusPhase.value;
});

function setPhase(next: SubmissionPhase) {
    return router.replace({ query: { ...route.query, step: next } });
}

const isDraft = computed(() => phase.value === 'draft');
const failure = computed(() => detail.value?.failure ?? null);
const failed = computed(() => phase.value === 'checks_running' && failure.value !== null);
const hasScores = computed(() => ['submitted', 'in_review', 'approved'].includes(phase.value));
const title = computed(
    () => card.value.name.trim() || found.value?.modelName || t('submission.untitled'),
);

// When it was submitted; a new submission says where it will be scored
const eyebrow = computed(() => {
    const submittedAt = found.value?.submittedAt;
    return submittedAt
        ? t('submission.eyebrowSubmitted', {
              date: d(new Date(submittedAt), { day: 'numeric', month: 'short' }),
          })
        : t('submission.eyebrow');
});

function formatDate(iso: string | null | undefined): string {
    return iso ? d(new Date(iso), { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
}

const rank = computed(() => detail.value?.review.rank ?? '—');

const statusText = computed(() => {
    if (failed.value) {
        return t('submission.status.checks_failed');
    }
    return phase.value === 'approved'
        ? t('submission.status.approved', { rank: rank.value })
        : t(`submission.status.${phase.value}`);
});

const notice = computed(() => {
    const review = detail.value?.review;
    if (failed.value && failure.value) {
        return {
            title: t('submission.notices.checks_failed.title', {
                check: t(`submission.checks.steps.${failure.value.check}.title`),
            }),
            body: t('submission.notices.checks_failed.body'),
        };
    }
    switch (phase.value) {
        case 'in_review':
            return {
                title: t('submission.notices.in_review.title'),
                body: t('submission.notices.in_review.body', {
                    date: formatDate(review?.openedAt),
                }),
            };
        case 'approved':
            return {
                title: t('submission.notices.approved.title', {
                    date: formatDate(review?.decidedAt),
                }),
                body: t('submission.notices.approved.body', {
                    owner: review?.reviewer ?? '—',
                    rank: rank.value,
                }),
                tone: 'success' as const,
            };
        default:
            return {
                title: t(`submission.notices.${phase.value}.title`),
                body: t(`submission.notices.${phase.value}.body`),
            };
    }
});

// Checks can start once there is a Dockerfile and every model card field is filled in
const isComplete = computed(
    () => dockerfile.value !== null && Object.values(card.value).every((v) => v.trim() !== ''),
);

interface PageAction {
    key: string;
    label: string;
    tone: 'neutral' | 'accent';
    disabled?: boolean;
    run: () => unknown;
}

const actions = computed<PageAction[]>(() => {
    switch (phase.value) {
        case 'draft':
            return [
                {
                    key: 'save',
                    label: savedRecently.value
                        ? t('submission.actions.saved')
                        : t('submission.actions.saveDraft'),
                    tone: 'neutral',
                    run: saveDraft,
                },
                {
                    key: 'run',
                    label: t('submission.actions.runChecks'),
                    tone: 'accent',
                    disabled: !isComplete.value,
                    run: () => setPhase('checks_running'),
                },
            ];
        case 'checks_running':
            return failed.value
                ? [
                      {
                          key: 'fix',
                          label: t('submission.actions.fixAndResubmit'),
                          tone: 'accent',
                          run: () => setPhase('draft'),
                      },
                  ]
                : [
                      {
                          key: 'cancel',
                          label: t('submission.actions.cancelRun'),
                          tone: 'neutral',
                          run: () => setPhase('draft'),
                      },
                  ];
        case 'submitted':
        case 'in_review':
            return [
                {
                    key: 'withdraw',
                    label: t('submission.actions.withdraw'),
                    tone: 'neutral',
                    run: () => setPhase('draft'),
                },
            ];
        // approved
        default:
            return [
                {
                    key: 'new',
                    label: t('submission.actions.newSubmission'),
                    tone: 'neutral',
                    run: () => router.push({ name: 'submission-new' }),
                },
                {
                    key: 'leaderboard',
                    label: t('submission.actions.viewOnLeaderboard'),
                    tone: 'accent',
                    run: viewOnLeaderboard,
                },
            ];
    }
});

// Mock: nothing is stored yet, the label only confirms the click
function saveDraft() {
    savedRecently.value = true;
    setTimeout(() => (savedRecently.value = false), 2000);
}

function viewOnLeaderboard() {
    const modelId = detail.value?.modelId;
    return router.push(
        modelId ? { name: 'leaderboard-model', params: { modelId } } : { name: 'leaderboard' },
    );
}

function selectDockerfile(file: File) {
    dockerfile.value = {
        name: file.name,
        sizeBytes: file.size,
        uploadedAt: new Date().toISOString(),
    };
}

onMounted(async () => {
    if (!submissions.list) {
        await submissions.load();
    }
});

// A new submission starts empty; an existing one loads its Dockerfile and model card
watch(
    submissionId,
    async (id) => {
        const loaded = id ? await submissions.loadDetail(id) : null;
        if (id !== submissionId.value) {
            return;
        }
        detail.value = loaded;
        card.value = loaded ? { ...loaded.card } : emptyCard();
        dockerfile.value = loaded?.dockerfile ?? null;
    },
    { immediate: true },
);
</script>

<style scoped lang="scss">
// Typography and flex come from the global classes in the template.
// The header and body sizes, gaps and their mobile variants stay here.
.submission-page {
    &__heading {
        gap: var(--or-spacing-md);
        min-height: 168px;
        padding: var(--or-spacing-lg) var(--or-spacing-lg) var(--or-spacing-md);
        border-bottom: 1px solid var(--or-border);

        &--draft {
            padding-bottom: var(--or-spacing-lg);
        }

        // After --draft: on mobile the draft header has no bottom padding either
        &--compact {
            gap: var(--or-spacing-sm-md);
            min-height: 0;
            padding: var(--or-spacing-lg) var(--or-spacing-md) 0;
            border-bottom: 0;

            .submission-page__identity {
                gap: var(--or-spacing-sm-md);
            }

            .submission-page__identity-text {
                gap: var(--or-spacing-xs);
                min-width: 0;
            }
        }
    }

    // The actions move under the title when both do not fit on one line
    &__identity {
        gap: var(--or-spacing-md) var(--or-spacing-md-lg);
    }

    // Not the `col` class: its min-width: 0 would compete with the min-width below
    &__identity-text {
        flex: 1 1 0;
        gap: var(--or-spacing-xxs);
        // Room for a short model name at 48px before the actions wrap
        min-width: min(100%, 340px);
    }

    &__actions {
        gap: var(--or-spacing-sm-md);
    }

    &__body {
        gap: var(--or-spacing-md);
        padding: var(--or-spacing-lg);

        &--compact {
            gap: var(--or-spacing-md-lg);
            padding: var(--or-spacing-xs) var(--or-spacing-md) var(--or-spacing-xl);
        }
    }

    &__mobile-actions {
        gap: var(--or-spacing-md-lg) var(--or-spacing-sm);

        &--row .submission-page__mobile-action:last-child {
            flex: 1 1 0;
        }
    }

    // Checks at the top, the notice at the bottom of the panel
    &__aside {
        min-height: 100%;
    }
}
</style>
