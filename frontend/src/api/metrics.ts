// Fake metrics endpoint backed by src/mocks/metrics.json, a mock of the scoring pipeline's
// scores.json (openrestor/metrics/pipeline.py and perceptual.py) for each model on each
// track, on the test split. The JSON keeps each metric as [degraded, restored]; this adds
// the direction (from its metric definitions) and the improvement, as the pipeline does.
// Swapping it for a real HTTP call later only changes this file.
import mock from 'src/mocks/metrics.json';
import type { MetricKey, MetricSummary, MetricValue, ModelMetrics } from 'src/types/metrics';
import { respond } from './respond';

interface MockSummary {
    items: number;
    metrics: Record<string, number[]>;
}

const definitions = mock.metricDefinitions as Record<MetricKey, 'higher' | 'lower'>;

function toSummary(summary: MockSummary): MetricSummary {
    const metrics = {} as Record<MetricKey, MetricValue>;
    for (const key of Object.keys(definitions) as MetricKey[]) {
        const [degraded, restored] = summary.metrics[key] ?? [];
        if (degraded === undefined || restored === undefined) {
            throw new Error(`Mock metrics have no "${key}"`);
        }
        const direction = definitions[key];
        metrics[key] = {
            direction,
            degraded,
            restored,
            // Positive when the restoration is better than the degraded input
            improvement: direction === 'higher' ? restored - degraded : degraded - restored,
        };
    }
    return { items: summary.items, metrics };
}

// GET /leaderboard/:trackId/models/:modelId/metrics: scores.json of the model's submission
export function fetchModelMetrics(trackId: string, modelId: string): Promise<ModelMetrics> {
    const tracks = mock.tracks as Record<
        string,
        Record<string, { overall: MockSummary; byCategory: Record<string, MockSummary> }>
    >;
    const report = tracks[trackId]?.[modelId];
    if (!report) {
        return Promise.reject(new Error(`No metrics for "${modelId}" on "${trackId}"`));
    }
    const result: ModelMetrics = {
        trackId,
        modelId,
        benchmarkVersion: mock.benchmarkVersion,
        overall: toSummary(report.overall),
        byCategory: Object.fromEntries(
            Object.entries(report.byCategory).map(([name, summary]) => [name, toSummary(summary)]),
        ),
    };
    return respond(result);
}
