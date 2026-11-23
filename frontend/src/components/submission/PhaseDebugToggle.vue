<template>
    <div
        class="phase-debug row no-wrap items-center text-overline text-no-wrap"
        :class="{ 'phase-debug--above-nav': aboveNav }"
        role="group"
        :aria-label="t('submission.debug.label')"
    >
        <span class="q-mr-xs text-warning">{{ t('submission.debug.label') }}</span>
        <button
            v-for="(phase, index) in SUBMISSION_PHASES"
            :key="phase"
            type="button"
            class="phase-debug__step plain-button"
            :class="{ 'phase-debug__step--active': phase === modelValue }"
            :title="t(`submission.debug.phases.${phase}`)"
            :aria-pressed="phase === modelValue"
            @click="emit('update:modelValue', phase)"
        >
            {{ index + 1 }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SUBMISSION_PHASES, type SubmissionPhase } from 'src/types/submissions';

// TEMPORARY debug control: jumps the submission page to any of the five stages, so each
// design state can be checked before the backend drives the flow. Remove with the mocks.
defineProps<{
    modelValue: SubmissionPhase;
    // Mobile: sit above the bottom navigation
    aboveNav?: boolean;
}>();

const emit = defineEmits<{ 'update:modelValue': [phase: SubmissionPhase] }>();

const { t } = useI18n();
</script>

<style scoped lang="scss">
// text-overline on the root sets the label style; the step buttons take its size and weight
// through plain-button's font: inherit.
.phase-debug {
    // Bottom centre: clear of the side panel's notice and of the page actions
    position: fixed;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3000;
    gap: var(--or-spacing-xs);
    padding: var(--or-spacing-xs) var(--or-spacing-xs) var(--or-spacing-xs) var(--or-spacing-sm);
    border: 1px dashed var(--q-warning);
    border-radius: var(--or-radius-pill);
    background: rgba(0, 0, 0, 0.85);

    &--above-nav {
        bottom: 76px;
    }

    &__step {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--or-bg-control);
        color: var(--or-text-soft);

        &--active {
            background: var(--q-warning);
            color: var(--or-text-on-accent);
        }
    }
}
</style>
