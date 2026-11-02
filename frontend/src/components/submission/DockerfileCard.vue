<template>
    <section class="dockerfile-card" :class="{ 'dockerfile-card--compact': compact }">
        <div class="dockerfile-card__heading">
            <h2 class="dockerfile-card__title">{{ t('submission.dockerfile.title') }}</h2>
            <template v-if="!compact">
                <span v-if="!locked" class="dockerfile-card__target">
                    {{ t('submission.dockerfile.target', { release }) }}
                    <img :src="expandIcon" width="8" height="4" alt="" />
                </span>
                <span v-else class="dockerfile-card__chips">
                    <span class="dockerfile-card__chip">
                        {{ t('submission.dockerfile.target', { release }) }}
                    </span>
                    <locked-badge />
                </span>
            </template>
        </div>

        <template v-if="locked">
            <div class="dockerfile-card__file">
                <span>{{ fileSummary }}</span>
                <locked-badge v-if="compact" />
            </div>
            <p v-if="!compact" class="dockerfile-card__hint">
                {{ t('submission.dockerfile.hiddenAudio') }}
            </p>
        </template>

        <div v-else class="dockerfile-card__upload">
            <div
                class="dockerfile-card__drop"
                :class="{ 'dockerfile-card__drop--over': dragging }"
                @dragover.prevent="dragging = true"
                @dragleave="dragging = false"
                @drop.prevent="drop"
            >
                <template v-if="file">
                    <strong>{{ file.name }}</strong>
                    <span class="dockerfile-card__hint">{{ fileSummary }}</span>
                </template>
                <template v-else>
                    <strong>{{
                        compact
                            ? t('submission.dockerfile.addMobile')
                            : t('submission.dockerfile.drop')
                    }}</strong>
                    <span class="dockerfile-card__hint">{{
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
                <button v-if="compact" type="button" class="dockerfile-card__link">
                    {{ t('submission.dockerfile.downloadTemplate') }}
                </button>
                <input
                    ref="input"
                    type="file"
                    class="dockerfile-card__input"
                    :aria-label="t('submission.dockerfile.browse')"
                    @change="pick"
                />
            </div>

            <div v-if="!compact" class="dockerfile-card__instructions">
                <strong>{{ t('submission.dockerfile.howItWorks') }}</strong>
                <p v-for="step in INSTRUCTIONS" :key="step">
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
.dockerfile-card {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
    border-radius: var(--or-radius-lg);
    background: var(--or-bg-raised);

    &__heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        min-height: 22px;
    }

    &__title {
        margin: 0;
        font-family: inherit;
        font-size: 18px;
        font-weight: 800;
        line-height: 1.25;
    }

    &__target {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        height: 36px;
        padding: 0 14px;
        border-radius: var(--or-radius-pill);
        background: var(--or-bg-control);
        font-size: 13px;
        font-weight: 700;
        white-space: nowrap;
    }

    &__chips {
        display: flex;
        gap: 8px;
    }

    &__chip {
        display: inline-flex;
        align-items: center;
        height: 22px;
        padding: 0 10px;
        border-radius: var(--or-radius-pill);
        background: var(--or-bg-control);
        color: var(--or-text-soft);
        font-size: 11px;
        font-weight: 600;
        white-space: nowrap;
    }

    &__file {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        font-size: 14px;
        font-weight: 700;
    }

    &__hint {
        margin: 0;
        color: var(--or-text-muted);
        font-size: 13px;
        line-height: 1.4;
    }

    &__upload {
        display: grid;
        grid-template-columns: minmax(0, 9fr) minmax(0, 8fr);
        gap: 20px;
        align-items: center;
        margin-top: 4px;
    }

    &__drop {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        align-self: stretch;
        padding: 24px 16px;
        border: 2px dashed var(--or-waveform-idle);
        border-radius: var(--or-radius-lg);
        text-align: center;
        transition: border-color 0.15s;

        strong {
            font-size: 14px;
            font-weight: 800;
        }

        &--over {
            border-color: var(--or-text);
        }
    }

    &__input {
        display: none;
    }

    &__link {
        padding: 0;
        border: 0;
        background: none;
        color: var(--or-text);
        font: inherit;
        font-size: 13px;
        font-weight: 500;
        text-decoration: underline;
        cursor: pointer;
    }

    &__instructions {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;

        strong {
            font-size: 14px;
            font-weight: 800;
        }

        p {
            margin: 0;
            color: var(--or-text-muted);
            font-size: 13px;
            line-height: 1.4;
        }
    }

    &--compact {
        padding: 16px;

        .dockerfile-card__title {
            font-size: 14px;
        }

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
