<template>
    <q-page
        class="workspace-page"
        :class="{
            'workspace-page--desktop': $q.screen.gt.sm,
            'workspace-page--wide': $q.screen.gt.md,
            'workspace-page--flush': flush,
        }"
        :style-fn="pageStyle"
    >
        <div class="workspace-page__main">
            <div v-if="$q.screen.gt.sm" class="release-accent" />
            <div class="workspace-page__content">
                <slot />
            </div>
        </div>
        <aside v-if="$slots.aside" class="workspace-page__aside">
            <slot name="aside" />
        </aside>
    </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';

// Page frame shared by every screen: main column, plus an optional right panel
// (now playing, compare, checks). The panel sits beside the main column from
// 1440px (the design width) and below it on smaller screens, where the
// main column would be too narrow for the tables.
defineProps<{
    // No padding around the main content (the page lays out its own full-width sections)
    flush?: boolean;
}>();

defineSlots<{
    default(): unknown;
    aside?(): unknown;
}>();

const $q = useQuasar();

// Side by side, the page is exactly the space between header and footer and each
// column scrolls on its own, so the panel stays put while the list scrolls.
// Otherwise the page grows with its content and the window scrolls.
function pageStyle(offset: number, height: number) {
    const size = `${height - offset}px`;
    return $q.screen.gt.md ? { height: size } : { minHeight: size };
}
</script>

<style scoped lang="scss">
.workspace-page {
    display: flex;
    flex-direction: column;

    &__main {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        min-width: 0;
    }

    &__content {
        padding: 20px 16px;
    }

    &__aside {
        padding: 0 16px 20px;
    }

    &--desktop {
        .workspace-page__content {
            padding: 24px;
        }

        .workspace-page__aside {
            padding: 20px 24px;
            background: var(--or-bg-panel);
            border-top: 1px solid var(--or-border);
        }
    }

    &--wide {
        flex-direction: row;

        .workspace-page__main,
        .workspace-page__aside {
            min-height: 0;
            overflow-y: auto;
        }

        .workspace-page__aside {
            flex: 0 0 360px;
            // Long values (checksums) must truncate instead of widening the panel
            min-width: 0;
            border-top: 0;
            border-left: 1px solid var(--or-border);
        }
    }

    &--flush .workspace-page__content {
        padding: 0;
    }
}
</style>
