<template>
    <section class="my-submissions">
        <h2 class="my-submissions__title text-overline text-subtle">
            {{ t('library.mySubmissions') }}
        </h2>

        <router-link
            v-for="submission in submissions"
            :key="submission.id"
            :to="{ name: 'submission', params: { id: submission.id } }"
            class="my-submissions__entry"
        >
            <model-avatar :name="submission.modelName" mine :size="28" />
            <span class="my-submissions__text">
                <span class="my-submissions__name text-subtitle2">{{ submission.modelName }}</span>
                <span class="my-submissions__meta text-muted">
                    <span :class="statusClass(submission.status)">
                        {{ t(`library.status.${submission.status}`) }}
                    </span>
                    <template v-if="hint(submission)"> · {{ hint(submission) }}</template>
                </span>
            </span>
        </router-link>

        <p v-if="submissions.length === 0" class="my-submissions__empty text-muted">
            {{ t('library.noSubmissions') }}
        </p>
    </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ModelAvatar from 'components/ModelAvatar.vue';
import type { Submission, SubmissionStatus } from 'src/types/submissions';

// "My submissions" in the sidebar: one entry per model, since each model has exactly one
// submission. The second line gives its status, and what to do next when there is something.
// The open entry is marked like the primary navigation.
defineProps<{
    submissions: Submission[];
}>();

const { t, d } = useI18n();

function statusClass(status: SubmissionStatus): string | undefined {
    if (status === 'approved') {
        return 'text-positive';
    }
    if (status === 'checks_failed' || status === 'rejected') {
        return 'text-negative';
    }
    return undefined;
}

// Second half of the status line: what to do next, or when it was submitted.
// Approved needs nothing more.
function hint(submission: Submission): string | null {
    switch (submission.status) {
        case 'checks_failed':
            return t('library.hints.fixAndResubmit');
        case 'approved':
            return null;
        default:
            return submission.submittedAt
                ? t('library.submittedOn', {
                      date: d(new Date(submission.submittedAt), { day: 'numeric', month: 'short' }),
                  })
                : t('library.hints.notSubmitted');
    }
}
</script>

<style scoped lang="scss">
.my-submissions {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &__title {
        margin: 0 0 8px;
        font-family: inherit;
        font-size: 12px;
        font-weight: 700;
        line-height: 1.4;
    }

    // Same box as the primary navigation items, so the open submission is marked the same way
    &__entry {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 44px;
        margin: 0 -8px;
        padding: 8px 12px 8px 5px;
        border-left: 3px solid transparent;
        border-radius: var(--or-radius-md);
        color: var(--or-text);
        text-decoration: none;

        &:hover {
            background: var(--or-bg-surface);
        }

        &.router-link-active {
            border-left-color: var(--q-primary);
            border-radius: var(--or-radius-lg);
            background: var(--or-bg-surface);
        }
    }

    &__text {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
    }

    &__meta {
        font-size: 13px;
        line-height: 1.25;
    }

    &__empty {
        margin: 0;
        font-size: 13px;
    }
}
</style>
