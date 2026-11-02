import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { fetchMySubmissions, fetchSubmission } from 'src/api/submissions';
import type { Submission, SubmissionDetail } from 'src/types/submissions';

export const useSubmissionsStore = defineStore('submissions', () => {
    // The signed-in researcher's submissions, one per model; null until loaded
    const list = ref<Submission[] | null>(null);

    let pending: Promise<void> | null = null;

    const myModelIds = computed(() => new Set(list.value?.map((s) => s.modelId) ?? []));

    // Loads once; later calls reuse the same request
    function load() {
        pending ??= fetchMySubmissions().then((data) => {
            list.value = data;
        });
        return pending;
    }

    // One of the signed-in researcher's models (shown distinctly on the leaderboard)
    function isMine(modelId: string): boolean {
        return myModelIds.value.has(modelId);
    }

    function find(id: string): Submission | null {
        return list.value?.find((s) => s.id === id) ?? null;
    }

    // Dockerfile, model card and scores of one submission (not cached: it changes while checks run)
    function loadDetail(id: string): Promise<SubmissionDetail | null> {
        return fetchSubmission(id);
    }

    return { list, load, isMine, find, loadDetail };
});
