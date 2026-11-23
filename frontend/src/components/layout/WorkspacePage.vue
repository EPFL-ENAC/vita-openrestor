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
// The grid places the page areas (main column and panel). Each page lays out its own content.
.workspace-page {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    // The main column fills the page height, the panel sits below it
    grid-template-rows: 1fr auto;

    &__content {
        padding: var(--or-spacing-md-lg) var(--or-spacing-md);
    }

    &__aside {
        padding: 0 var(--or-spacing-md) var(--or-spacing-md-lg);
    }

    &--desktop {
        .workspace-page__content {
            padding: var(--or-spacing-lg);
        }

        .workspace-page__aside {
            padding: var(--or-spacing-md-lg) var(--or-spacing-lg);
            background: var(--or-bg-panel);
            border-top: 1px solid var(--or-border);
        }
    }

    &--wide {
        // The auto column takes the panel width, and is empty on a page without a panel
        grid-template-columns: minmax(0, 1fr) auto;
        grid-template-rows: minmax(0, 1fr);

        .workspace-page__main,
        .workspace-page__aside {
            overflow-y: auto;
        }

        .workspace-page__aside {
            // A fixed width, so long values (checksums) truncate instead of widening the panel
            width: 360px;
            border-top: 0;
            border-left: 1px solid var(--or-border);
        }
    }

    &--flush .workspace-page__content {
        padding: 0;
    }
}
</style>
