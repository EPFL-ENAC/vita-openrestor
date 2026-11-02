// Fake datasets endpoints backed by src/mocks/datasets.json.
// Swapping them for real HTTP calls later only changes this file.
import mock from 'src/mocks/datasets.json';
import audio from 'src/mocks/audio.json';
import type { DatasetCatalog, DatasetSplit, SplitPart } from 'src/types/datasets';
import { respond } from './respond';

// GET /datasets
export function fetchCatalog(): Promise<DatasetCatalog> {
    const catalog: DatasetCatalog = {
        ...mock,
        tracks: mock.tracks.map((track) => ({
            ...track,
            splits: track.splits.map((split) => ({
                ...split,
                id: split.id as DatasetSplit['id'],
                parts: split.parts as SplitPart[],
                // Every clip uses the same mock audio until the API serves real clips
                samples: split.samples.map((sample) => ({
                    ...sample,
                    audio: { original: audio.original, degraded: audio.degraded },
                })),
            })),
        })),
    };
    return respond(catalog);
}
