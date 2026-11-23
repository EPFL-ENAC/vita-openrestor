<template>
    <section class="track-details q-pa-md rounded-lg bg-raised">
        <h2 class="text-subtitle2 text-weight-bolder q-mt-none q-mb-sm">{{ track.name }}</h2>
        <dl class="q-ma-none">
            <div
                v-for="field in fields"
                :key="field.key"
                class="track-details__field row no-wrap items-center text-body1"
            >
                <dt class="track-details__label text-muted">
                    {{ t(`datasets.fields.${field.key}`) }}
                </dt>
                <dd class="col ellipsis text-weight-bold q-ma-none" :title="field.value">
                    {{ field.value }}
                </dd>
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
    &__field {
        min-height: 37px;
        border-top: 1px solid var(--or-border);
    }

    &__label {
        flex: 0 0 110px;
    }
}
</style>
