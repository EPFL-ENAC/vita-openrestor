// Fake submissions endpoint backed by src/mocks/submissions.json.
import mock from 'src/mocks/submissions.json';
import type { Submission, SubmissionDetail } from 'src/types/submissions';
import { respond } from './respond';

// GET /me/submissions: the signed-in researcher's submissions, one per model
export function fetchMySubmissions(): Promise<Submission[]> {
    return respond(mock.submissions as Submission[]);
}

// GET /me/submissions/:id: one submission with its Dockerfile, model card and scores.
// null when the mock has no details for it.
export function fetchSubmission(id: string): Promise<SubmissionDetail | null> {
    const details = mock.details as Record<string, SubmissionDetail>;
    return respond(details[id] ?? null);
}
