<template>
    <section class="my-submissions column no-wrap">
        <h2 class="text-overline text-subtle q-mt-none q-mb-sm">
            {{ t('library.mySubmissions') }}
        </h2>

        <router-link
            v-for="submission in submissions"
            :key="submission.id"
            :to="{ name: 'submission', params: { id: submission.id } }"
            class="my-submissions__entry row no-wrap items-center"
        >
            <model-avatar :name="submission.modelName" mine :size="28" />
            <span class="my-submissions__text col-shrink column no-wrap">
                <span class="text-subtitle2">{{ submission.modelName }}</span>
                <span class="text-body2 text-muted">
                    <span :class="statusClass(submission.status)">
                        {{ t(`library.status.${submission.status}`) }}
                    </span>
                    <template v-if="hint(submission)"> · {{ hint(submission) }}</template>
                </span>
            </span>
        </router-link>

        <p v-if="submissions.length === 0" class="text-body2 text-muted q-my-none">
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
// Typography, text colors and flex come from the global classes in the template
.my-submissions {
    gap: var(--or-spacing-sm);

    // Same box as the primary navigation items, so the open submission is marked the same way
    &__entry {
        gap: var(--or-spacing-sm);
        min-height: 44px;
        margin: 0 calc(-1 * var(--or-spacing-sm));
        // Left padding minus the 3px border, so the avatar lines up with the title
        padding: var(--or-spacing-sm) var(--or-spacing-sm-md) var(--or-spacing-sm)
            calc(var(--or-spacing-sm) - 3px);
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
        gap: var(--or-spacing-xxs);
    }
}
</style>
