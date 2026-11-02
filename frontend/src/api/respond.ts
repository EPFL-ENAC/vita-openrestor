// Shared by the fake endpoints: answers after a short delay, like a real HTTP call.
// The value is copied, so a page that changes what it got does not change the mock data.
// The copy goes through JSON, as a real response would, because structuredClone is not
// in Safari 14 (one of the build targets in quasar.config.ts).
const LATENCY_MS = 250;

export function respond<T>(value: T): Promise<T> {
    const copy = JSON.parse(JSON.stringify(value)) as T;
    return new Promise((resolve) => setTimeout(() => resolve(copy), LATENCY_MS));
}
