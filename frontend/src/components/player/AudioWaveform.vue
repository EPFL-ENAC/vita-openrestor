<template>
    <!-- A slider when it seeks (the player); a picture otherwise (the comparison panel) -->
    <div
        class="audio-waveform"
        :class="{ 'audio-waveform--idle': idle, 'audio-waveform--seekable': seekable }"
        :style="{ height: `${height}px` }"
        :role="seekable ? 'slider' : undefined"
        :tabindex="seekable ? 0 : undefined"
        :aria-label="seekable ? seekLabel : undefined"
        :aria-valuemin="seekable ? 0 : undefined"
        :aria-valuemax="seekable ? 100 : undefined"
        :aria-valuenow="seekable ? Math.round(progress * 100) : undefined"
        :aria-valuetext="seekable ? valueText : undefined"
        @click="onClick"
        @keydown="onKeydown"
    >
        <q-resize-observer @resize="(size) => (width = size.width)" />
        <span
            v-for="(peak, index) in bars"
            :key="index"
            class="audio-waveform__bar"
            :class="{ 'audio-waveform__bar--played': index < playedBars }"
            :style="{ height: `${Math.max(MIN_BAR_HEIGHT, peak * height)}px` }"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
    // 0..1 values, resampled to fit the available width
    peaks: number[];
    // 0..1 share already played
    progress: number;
    height: number;
    // Nothing loaded: all bars grey, clicks ignored
    idle?: boolean;
    // Given only where the waveform seeks: its accessible name, the position read out
    // (e.g. "00:12 of 00:30") and the share of the clip that one arrow key moves
    // (5% when not given)
    seekLabel?: string;
    valueText?: string;
    step?: number | undefined;
}>();

const emit = defineEmits<{ seek: [fraction: number] }>();

// Bar width + gap, from the design (1.6px bars, ~1.4px gaps)
const BAR_PITCH = 3;
const MIN_BAR_HEIGHT = 4;

const width = ref(0);

const bars = computed(() => {
    const count = Math.floor(width.value / BAR_PITCH);
    const source = props.peaks;
    if (count === 0 || source.length === 0) {
        return [];
    }
    return Array.from({ length: count }, (_, i) => {
        const start = Math.floor((i * source.length) / count);
        const end = Math.max(start + 1, Math.floor(((i + 1) * source.length) / count));
        return Math.max(...source.slice(start, end));
    });
});

const playedBars = computed(() => Math.round(props.progress * bars.value.length));

const seekable = computed(() => props.seekLabel !== undefined && !props.idle);

function onClick(event: MouseEvent) {
    if (!seekable.value || width.value === 0) {
        return;
    }
    const target = event.currentTarget as HTMLElement;
    emit('seek', (event.clientX - target.getBoundingClientRect().left) / width.value);
}

// Arrows move by one step, Page Up / Page Down by a tenth, Home / End to either end
function onKeydown(event: KeyboardEvent) {
    if (!seekable.value) {
        return;
    }
    const step = props.step ?? 0.05;
    const targets: Record<string, number> = {
        ArrowRight: props.progress + step,
        ArrowUp: props.progress + step,
        ArrowLeft: props.progress - step,
        ArrowDown: props.progress - step,
        PageUp: props.progress + 0.1,
        PageDown: props.progress - 0.1,
        Home: 0,
        End: 1,
    };
    const target = targets[event.key];
    if (target === undefined) {
        return;
    }
    event.preventDefault();
    emit('seek', Math.min(1, Math.max(0, target)));
}
</script>

<style scoped lang="scss">
.audio-waveform {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;

    &--seekable {
        cursor: pointer;

        &:focus-visible {
            outline: 2px solid var(--q-primary);
            outline-offset: 2px;
            border-radius: var(--or-radius-sm);
        }
    }

    &__bar {
        flex: 0 0 1.6px;
        background: var(--or-text);

        &--played {
            background: var(--q-primary);
        }

        .audio-waveform--idle & {
            background: var(--or-waveform-idle);
        }
    }
}
</style>
