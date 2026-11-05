<template>
    <q-layout view="hHh LpR fFf">
        <q-header v-if="!isDesktop">
            <mobile-header />
        </q-header>

        <q-drawer
            v-if="isDesktop"
            :model-value="true"
            side="left"
            behavior="desktop"
            :width="288"
            bordered
            persistent
            class="bg-sunken"
        >
            <app-sidebar />
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>

        <q-footer v-if="showPlayer || !isDesktop" class="bg-transparent">
            <audio-player v-if="showPlayer" :compact="!isDesktop" />
            <primary-nav v-if="!isDesktop" layout="bottom" />
        </q-footer>
    </q-layout>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import AppSidebar from 'components/layout/AppSidebar.vue';
import MobileHeader from 'components/layout/MobileHeader.vue';
import PrimaryNav from 'components/layout/PrimaryNav.vue';
import AudioPlayer from 'components/player/AudioPlayer.vue';
import { usePlayerStore } from 'src/stores/player';

const $q = useQuasar();
const route = useRoute();
const player = usePlayerStore();

// Desktop shell (sidebar) from Quasar's md breakpoint; below it, mobile header + bottom navigation
const isDesktop = computed(() => $q.screen.gt.sm);
// The player appears once a sound is loaded (it stays while paused), on the pages that
// play sound: datasets and leaderboard (see route meta.hidePlayer)
const showPlayer = computed(() => route.meta.hidePlayer !== true && player.track !== null);
// A page without the player has no way to stop the sound, so leaving for one pauses it.
// The player comes back, paused, on the next page that shows it.
watch(
    () => route.meta.hidePlayer === true,
    (hidden) => {
        if (hidden) {
            player.pause();
        }
    },
);
</script>
