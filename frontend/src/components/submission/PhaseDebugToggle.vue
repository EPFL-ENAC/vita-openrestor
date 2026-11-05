<template>
    <div
        class="phase-debug"
        :class="{ 'phase-debug--above-nav': aboveNav }"
        role="group"
        :aria-label="t('submission.debug.label')"
    >
        <span class="phase-debug__label">{{ t('submission.debug.label') }}</span>
        <button
            v-for="(phase, index) in SUBMISSION_PHASES"
            :key="phase"
            type="button"
            class="phase-debug__step"
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
.phase-debug {
    // Bottom centre: clear of the side panel's notice and of the page actions
    position: fixed;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3000;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 4px 4px 10px;
    border: 1px dashed var(--q-warning);
    border-radius: var(--or-radius-pill);
    background: rgba(0, 0, 0, 0.85);
    font-size: 11px;
    white-space: nowrap;

    &--above-nav {
        bottom: 76px;
    }

    &__label {
        margin-right: 4px;
        color: var(--q-warning);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
    }

    &__step {
        width: 24px;
        height: 24px;
        padding: 0;
        border: 0;
        border-radius: 50%;
        background: var(--or-bg-control);
        color: var(--or-text-soft);
        font: inherit;
        font-weight: 700;
        cursor: pointer;

        &--active {
            background: var(--q-warning);
            color: var(--or-text-on-accent);
        }
    }
}
</style>
