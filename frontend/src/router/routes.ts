import type { RouteRecordRaw } from 'vue-router';

declare module 'vue-router' {
    interface RouteMeta {
        public?: boolean;
        // Hide the audio player (submission pages: nothing plays there)
        hidePlayer?: boolean;
    }
}

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('layouts/MainLayout.vue'),
        children: [
            { path: '', redirect: { name: 'datasets' } },
            {
                path: 'leaderboard',
                name: 'leaderboard',
                component: () => import('pages/LeaderboardPage.vue'),
            },
            {
                path: 'leaderboard/:modelId',
                name: 'leaderboard-model',
                component: () => import('pages/LeaderboardModelPage.vue'),
            },
            {
                path: 'datasets',
                name: 'datasets',
                component: () => import('pages/DatasetsPage.vue'),
            },
            {
                path: 'submissions/new',
                name: 'submission-new',
                component: () => import('pages/SubmissionPage.vue'),
                meta: { hidePlayer: true },
            },
            {
                path: 'submissions/:id',
                name: 'submission',
                component: () => import('pages/SubmissionPage.vue'),
                meta: { hidePlayer: true },
            },
        ],
    },
    {
        path: '/signin',
        component: () => import('pages/SigninPage.vue'),
        meta: { public: true },
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue'),
    },
];

export default routes;
