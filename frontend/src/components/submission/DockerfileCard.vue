<template>
    <section
        class="dockerfile-card column no-wrap bg-raised"
        :class="{ 'dockerfile-card--compact': compact }"
    >
        <div class="dockerfile-card__heading row no-wrap items-center justify-between">
            <h2
                class="q-my-none"
                :class="compact ? 'text-subtitle2 text-weight-bolder' : 'text-h5'"
            >
                {{ t('submission.dockerfile.title') }}
            </h2>
            <template v-if="!compact">
                <span
                    v-if="!locked"
                    class="dockerfile-card__target row no-wrap items-center text-body2 text-weight-bold text-no-wrap bg-control"
                >
                    {{ t('submission.dockerfile.target', { release }) }}
                    <img :src="expandIcon" width="8" height="4" alt="" />
                </span>
                <span v-else class="dockerfile-card__chips row no-wrap">
                    <span
                        class="dockerfile-card__chip row no-wrap items-center text-caption text-weight-bold text-soft text-no-wrap bg-control"
                    >
                        {{ t('submission.dockerfile.target', { release }) }}
                    </span>
                    <locked-badge />
                </span>
            </template>
        </div>

        <template v-if="locked">
            <div
                class="dockerfile-card__file row no-wrap items-center justify-between text-subtitle2"
            >
                <span>{{ fileSummary }}</span>
                <locked-badge v-if="compact" />
            </div>
            <p v-if="!compact" class="q-my-none text-body2 text-muted">
                {{ t('submission.dockerfile.hiddenAudio') }}
            </p>
        </template>

        <div v-else class="dockerfile-card__upload items-center">
            <div
                class="dockerfile-card__drop column no-wrap items-center justify-center self-stretch text-center"
                :class="{ 'dockerfile-card__drop--over': dragging }"
                @dragover.prevent="dragging = true"
                @dragleave="dragging = false"
                @drop.prevent="drop"
            >
                <template v-if="file">
                    <strong class="text-subtitle2 text-weight-bolder">{{ file.name }}</strong>
                    <span class="text-body2 text-muted">{{ fileSummary }}</span>
                </template>
                <template v-else>
                    <strong class="text-subtitle2 text-weight-bolder">{{
                        compact
                            ? t('submission.dockerfile.addMobile')
                            : t('submission.dockerfile.drop')
                    }}</strong>
                    <span class="text-body2 text-muted">{{
                        compact
                            ? t('submission.dockerfile.dropHintMobile')
                            : t('submission.dockerfile.dropHint')
                    }}</span>
                </template>
                <action-button
                    tone="inverted"
                    :label="
                        file
                            ? t('submission.dockerfile.replace')
                            : t('submission.dockerfile.browse')
                    "
                    @click="input?.click()"
                />
                <button
                    v-if="compact"
                    type="button"
                    class="dockerfile-card__link plain-button text-body2"
                >
                    {{ t('submission.dockerfile.downloadTemplate') }}
                </button>
                <input
                    ref="input"
                    type="file"
                    class="hidden"
                    :aria-label="t('submission.dockerfile.browse')"
                    @change="pick"
                />
            </div>

            <div v-if="!compact" class="dockerfile-card__instructions column no-wrap items-start">
                <strong class="text-subtitle2 text-weight-bolder">
                    {{ t('submission.dockerfile.howItWorks') }}
                </strong>
                <p v-for="step in INSTRUCTIONS" :key="step" class="q-my-none text-body2 text-muted">
                    {{ t(`submission.dockerfile.instructions.${step}`) }}
                </p>
                <!-- No template is published yet: the button does nothing for now -->
                <action-button :label="t('submission.dockerfile.downloadTemplate')" />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ActionButton from 'components/ActionButton.vue';
import LockedBadge from 'components/LockedBadge.vue';
import expandIcon from 'assets/icons/expand-8.svg';
import type { SubmittedFile } from 'src/types/submissions';

// The submission's Dockerfile (organism/Submission/Dockerfile). In a draft: a drop zone
// and how the container is run. Once submitted: the file, locked.
const props = defineProps<{
    file: SubmittedFile | null;
    locked?: boolean;
    compact?: boolean;
    // Dataset release the submission is scored on
    release: string;
}>();

const emit = defineEmits<{ select: [file: File] }>();

const { t, d, locale } = useI18n();

const INSTRUCTIONS = ['template', 'io', 'hidden'] as const;

const input = ref<HTMLInputElement | null>(null);
const dragging = ref(false);

function formatSize(bytes: number): string {
    if (bytes < 1000) {
        return `${bytes} B`;
    }
    const kb = new Intl.NumberFormat(locale.value, { maximumFractionDigits: 1 }).format(
        bytes / 1000,
    );
    return `${kb} KB`;
}

const fileSummary = computed(() => {
    if (!props.file) {
        return t('submission.dockerfile.noFile');
    }
    const size = formatSize(props.file.sizeBytes);
    if (props.compact) {
        return t('submission.dockerfile.fileShort', { size });
    }
    const date = d(new Date(props.file.uploadedAt), { day: 'numeric', month: 'short' });
    return t('submission.dockerfile.file', { size, date });
});

function pick(event: Event) {
    const target = event.target as HTMLInputElement;
    const chosen = target.files?.[0];
    if (chosen) {
        emit('select', chosen);
    }
    // Choosing the same file again must fire change again
    target.value = '';
}

function drop(event: DragEvent) {
    dragging.value = false;
    const chosen = event.dataTransfer?.files[0];
    if (chosen) {
        emit('select', chosen);
    }
}
</script>

<style scoped lang="scss">
// Typography, colors and flex come from the global classes in the template.
// Only the card's sizes, gaps, the upload grid and the drop zone border stay here.
.dockerfile-card {
    gap: var(--or-spacing-sm);
    padding: var(--or-spacing-md-lg);
    border-radius: var(--or-radius-lg);

    &__heading {
        gap: var(--or-spacing-sm);
        min-height: 22px;
    }

    &__target {
        gap: var(--or-spacing-sm);
        height: 36px;
        padding: 0 var(--or-spacing-sm-md);
        border-radius: var(--or-radius-pill);
    }

    &__chips {
        gap: var(--or-spacing-sm);
    }

    &__chip {
        height: 22px;
        padding: 0 var(--or-spacing-sm);
        border-radius: var(--or-radius-pill);
    }

    &__file {
        gap: var(--or-spacing-sm);
    }

    &__upload {
        display: grid;
        grid-template-columns: minmax(0, 9fr) minmax(0, 8fr);
        gap: var(--or-spacing-md-lg);
        margin-top: var(--or-spacing-xs);
    }

    &__drop {
        gap: var(--or-spacing-sm);
        padding: var(--or-spacing-lg) var(--or-spacing-md);
        border: 2px dashed var(--or-waveform-idle);
        border-radius: var(--or-radius-lg);
        transition: border-color 0.15s;

        &--over {
            border-color: var(--or-text);
        }
    }

    &__link {
        color: var(--or-text);
        text-decoration: underline;
    }

    &__instructions {
        gap: var(--or-spacing-sm);
    }

    &--compact {
        padding: var(--or-spacing-md);

        .dockerfile-card__upload {
            display: flex;
            margin-top: 0;
        }

        .dockerfile-card__drop {
            flex: 1 1 auto;
        }
    }
}
</style>
