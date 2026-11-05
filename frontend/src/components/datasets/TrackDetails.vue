<template>
    <section class="track-details">
        <h2 class="track-details__title">{{ track.name }}</h2>
        <dl class="track-details__fields">
            <div v-for="field in fields" :key="field.key" class="track-details__field">
                <dt>{{ t(`datasets.fields.${field.key}`) }}</dt>
                <dd :title="field.value">{{ field.value }}</dd>
            </div>
        </dl>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { DatasetInfo, DatasetTrack, SplitId } from 'src/types/datasets';

// Facts about the selected track (right panel of the datasets page)
const props = defineProps<{
    track: DatasetTrack;
    dataset: DatasetInfo;
}>();

const { t, n } = useI18n();

const fields = computed(() => {
    const clips = (id: SplitId) => props.track.splits.find((s) => s.id === id)?.clipCount ?? 0;
    return [
        { key: 'trainClips', value: n(clips('train')) },
        { key: 'testClips', value: n(clips('test')) },
        { key: 'versionsPerClip', value: props.track.versionsPerClip },
        {
            key: 'degradations',
            value: props.track.degradations.length
                ? n(props.track.degradations.length)
                : t('datasets.fields.undocumented'),
        },
        {
            key: 'clipLength',
            value: t('datasets.fields.seconds', { seconds: props.dataset.clipSeconds }),
        },
        { key: 'audioFormat', value: props.dataset.audioFormat },
        { key: 'metadata', value: props.dataset.metadataStandards.join(', ') },
        { key: 'licence', value: props.dataset.licence },
        { key: 'version', value: props.dataset.version },
    ];
});
</script>

<style scoped lang="scss">
.track-details {
    padding: 16px;
    border-radius: var(--or-radius-lg);
    background: var(--or-bg-raised);
    font-family: 'Roboto', sans-serif;

    &__title {
        margin: 0 0 8px;
        font-size: 15px;
        font-weight: 900;
        line-height: 1.25;
    }

    &__fields {
        margin: 0;
    }

    &__field {
        display: flex;
        align-items: center;
        min-height: 37px;
        border-top: 1px solid var(--or-border);
        font-size: 14px;

        dt {
            flex: 0 0 110px;
            color: var(--or-text-muted);
        }

        dd {
            flex: 1 1 0;
            min-width: 0;
            margin: 0;
            overflow: hidden;
            font-weight: 700;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
</style>
