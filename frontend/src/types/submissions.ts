// A model is what the leaderboard ranks. A submission is the request to get it scored:
// one Dockerfile plus its model card. Each model has exactly one submission; fixing or
// updating it changes that submission, there are no versions.
export type SubmissionStatus =
    | 'draft'
    | 'checks_running'
    | 'checks_failed'
    | 'submitted'
    | 'in_review'
    | 'approved'
    | 'rejected';

export interface Submission {
    id: string;
    modelId: string;
    modelName: string;
    status: SubmissionStatus;
    // ISO date; null for drafts
    submittedAt: string | null;
}

// Where the submission page is in the five-stage flow (molecule/Submission/Progress).
// Narrower than SubmissionStatus: failed checks and rejection have no design yet.
export const SUBMISSION_PHASES = [
    'draft',
    'checks_running',
    'submitted',
    'in_review',
    'approved',
] as const;
export type SubmissionPhase = (typeof SUBMISSION_PHASES)[number];

// The model card filled in with each submission. Empty strings are unfilled fields.
export interface ModelCardFields {
    name: string;
    authors: string;
    architecture: string;
    parameters: string;
    trainingData: string;
    codeRepo: string;
    dataRepo: string;
    paper: string;
    licence: string;
}

// The four checks a run goes through, in order
export const SUBMISSION_CHECKS = ['imageBuild', 'metadata', 'dockerfile', 'scoring'] as const;
export type SubmissionCheck = (typeof SUBMISSION_CHECKS)[number];

export interface SubmittedFile {
    name: string;
    sizeBytes: number;
    // ISO date
    uploadedAt: string;
}

export interface SubmissionDetail {
    id: string;
    modelId: string;
    card: ModelCardFields;
    dockerfile: SubmittedFile | null;
    // Scores from the quality check; null until it ran
    snrGain: number | null;
    // Listening test score; null until the owner review completes
    listening: number | null;
    review: {
        // ISO dates; null until it happened
        openedAt: string | null;
        decidedAt: string | null;
        reviewer: string | null;
        // Rank on the leaderboard once approved
        rank: number | null;
    };
    // Set when the last run stopped at a failed check
    failure: { check: SubmissionCheck; message: string } | null;
}
