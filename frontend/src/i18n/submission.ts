import type { Messages } from './types';

// Submission page. One entry per key, English and French side by side.
export const submissionMessages = {
    'submission.eyebrow': {
        en: 'New submission · scored on all 3 tracks',
        fr: 'Nouvelle soumission · évaluée sur les 3 pistes',
    },

    'submission.eyebrowSubmitted': {
        en: 'Submitted {date} · scored on all 3 tracks',
        fr: 'Soumise le {date} · évaluée sur les 3 pistes',
    },

    'submission.untitled': {
        en: 'New model',
        fr: 'Nouveau modèle',
    },

    'submission.locked': {
        en: 'Locked',
        fr: 'Verrouillé',
    },

    'submission.stageOf': {
        en: 'Stage {n} of {total} · {stage}',
        fr: 'Étape {n} sur {total} · {stage}',
    },

    'submission.stages.draft': {
        en: 'Draft',
        fr: 'Brouillon',
    },
    'submission.stages.checks': {
        en: 'Checks',
        fr: 'Vérifications',
    },
    'submission.stages.checksRunning': {
        en: 'Checks running',
        fr: 'Vérifications en cours',
    },
    'submission.stages.checksFailed': {
        en: 'Checks failed',
        fr: 'Vérifications échouées',
    },
    'submission.stages.submitted': {
        en: 'Submitted',
        fr: 'Soumise',
    },
    'submission.stages.in_review': {
        en: 'In review',
        fr: 'En revue',
    },
    'submission.stages.decision': {
        en: 'Decision',
        fr: 'Décision',
    },
    'submission.stages.approved': {
        en: 'Approved',
        fr: 'Approuvée',
    },

    'submission.status.draft': {
        en: 'Draft',
        fr: 'Brouillon',
    },
    'submission.status.checks_running': {
        en: 'Checks running',
        fr: 'Vérifications en cours',
    },
    'submission.status.checks_failed': {
        en: 'Checks failed',
        fr: 'Vérifications échouées',
    },
    'submission.status.submitted': {
        en: 'Submitted',
        fr: 'Soumise',
    },
    'submission.status.in_review': {
        en: 'In review',
        fr: 'En revue',
    },
    'submission.status.approved': {
        en: 'Approved, rank {rank}',
        fr: 'Approuvée, rang {rank}',
    },

    'submission.actions.saveDraft': {
        en: 'Save draft',
        fr: 'Enregistrer le brouillon',
    },
    'submission.actions.saved': {
        en: 'Draft saved',
        fr: 'Brouillon enregistré',
    },
    'submission.actions.runChecks': {
        en: 'Run checks',
        fr: 'Lancer les vérifications',
    },
    'submission.actions.cancelRun': {
        en: 'Cancel run',
        fr: 'Annuler',
    },
    'submission.actions.fixAndResubmit': {
        en: 'Fix and resubmit',
        fr: 'Corriger et resoumettre',
    },
    'submission.actions.withdraw': {
        en: 'Withdraw submission',
        fr: 'Retirer la soumission',
    },
    'submission.actions.newSubmission': {
        en: 'New submission',
        fr: 'Nouvelle soumission',
    },
    'submission.actions.viewOnLeaderboard': {
        en: 'View on leaderboard',
        fr: 'Voir au classement',
    },

    'submission.checks.title': {
        en: 'Checks',
        fr: 'Vérifications',
    },
    'submission.checks.description': {
        en: 'Four checks, in order. A failed check blocks review.',
        fr: 'Quatre vérifications, dans l’ordre. Un échec bloque la revue.',
    },
    'submission.checks.states.notStarted': {
        en: 'Not started',
        fr: 'Pas commencée',
    },
    'submission.checks.states.queued': {
        en: 'Queued',
        fr: 'En attente',
    },
    'submission.checks.states.running': {
        en: 'Running',
        fr: 'En cours',
    },
    'submission.checks.states.passed': {
        en: 'Passed',
        fr: 'Réussie',
    },
    'submission.checks.states.failed': {
        en: 'Failed',
        fr: 'Échouée',
    },
    'submission.checks.states.notRun': {
        en: 'Not run',
        fr: 'Non lancée',
    },
    'submission.checks.failed': {
        en: 'Failed. {message}',
        fr: 'Échouée. {message}',
    },
    'submission.checks.notRun': {
        en: 'Not run. An earlier check failed.',
        fr: 'Non lancée. Une vérification précédente a échoué.',
    },
    'submission.checks.steps.imageBuild.title': {
        en: 'Image build',
        fr: 'Construction de l’image',
    },
    'submission.checks.steps.imageBuild.notStarted': {
        en: 'Not started. Builds your image and checks that it starts.',
        fr: 'Pas commencée. Construit votre image et vérifie qu’elle démarre.',
    },
    'submission.checks.steps.imageBuild.passed': {
        en: 'Passed. Image built and started.',
        fr: 'Réussie. Image construite et démarrée.',
    },
    'submission.checks.steps.metadata.title': {
        en: 'Metadata completeness',
        fr: 'Métadonnées complètes',
    },
    'submission.checks.steps.metadata.notStarted': {
        en: 'Not started. Checks that the model card is complete.',
        fr: 'Pas commencée. Vérifie que la fiche du modèle est complète.',
    },
    'submission.checks.steps.metadata.running': {
        en: 'Running. Checking model card fields.',
        fr: 'En cours. Vérification des champs de la fiche du modèle.',
    },
    'submission.checks.steps.metadata.passed': {
        en: 'Passed. All model card fields complete.',
        fr: 'Réussie. Tous les champs de la fiche sont remplis.',
    },
    'submission.checks.steps.dockerfile.title': {
        en: 'Dockerfile',
        fr: 'Dockerfile',
    },
    'submission.checks.steps.dockerfile.notStarted': {
        en: 'Not started. Reviews the Dockerfile before scoring.',
        fr: 'Pas commencée. Examine le Dockerfile avant l’évaluation.',
    },
    'submission.checks.steps.dockerfile.queued': {
        en: 'Queued. Starts when the metadata check passes.',
        fr: 'En attente. Commence quand la vérification des métadonnées réussit.',
    },
    'submission.checks.steps.dockerfile.passed': {
        en: 'Passed. No issues found in the Dockerfile.',
        fr: 'Réussie. Aucun problème trouvé dans le Dockerfile.',
    },
    'submission.checks.steps.dockerfile.subSteps.envVars': {
        en: 'Checks for environment variables',
        fr: 'Recherche de variables d’environnement',
    },
    'submission.checks.steps.dockerfile.subSteps.llmReview': {
        en: 'LLM review of the Dockerfile',
        fr: 'Revue du Dockerfile par un LLM',
    },
    'submission.checks.steps.scoring.title': {
        en: 'Quality scoring',
        fr: 'Évaluation de la qualité',
    },
    'submission.checks.steps.scoring.notStarted': {
        en: 'Not started. Runs your model on the test audio and computes SNR gain [and other metrics].',
        fr: 'Pas commencée. Exécute votre modèle sur l’audio de test et calcule le gain SNR [et d’autres métriques].',
    },
    'submission.checks.steps.scoring.queued': {
        en: 'Queued. Starts when the Dockerfile check passes.',
        fr: 'En attente. Commence quand la vérification du Dockerfile réussit.',
    },
    'submission.checks.steps.scoring.passed': {
        en: 'Passed. Scores computed.',
        fr: 'Réussie. Scores calculés.',
    },

    'submission.dockerfile.title': {
        en: 'Dockerfile',
        fr: 'Dockerfile',
    },
    'submission.dockerfile.target': {
        en: 'All 3 tracks · {release}',
        fr: 'Les 3 pistes · {release}',
    },
    'submission.dockerfile.drop': {
        en: 'Drop your Dockerfile here',
        fr: 'Déposez votre Dockerfile ici',
    },
    'submission.dockerfile.dropHint': {
        en: 'One Dockerfile that builds and runs your model. No audio files.',
        fr: 'Un Dockerfile qui construit et exécute votre modèle. Pas de fichiers audio.',
    },
    'submission.dockerfile.addMobile': {
        en: 'Add your Dockerfile',
        fr: 'Ajoutez votre Dockerfile',
    },
    'submission.dockerfile.dropHintMobile': {
        en: 'Start from the template. No audio files: we run your model on the test audio.',
        fr: 'Partez du modèle. Pas de fichiers audio : nous exécutons votre modèle sur l’audio de test.',
    },
    'submission.dockerfile.browse': {
        en: 'Browse files',
        fr: 'Parcourir',
    },
    'submission.dockerfile.replace': {
        en: 'Replace file',
        fr: 'Remplacer le fichier',
    },
    'submission.dockerfile.howItWorks': {
        en: 'How it works',
        fr: 'Fonctionnement',
    },
    'submission.dockerfile.instructions.template': {
        en: '1. Start from the template.',
        fr: '1. Partez du modèle de Dockerfile.',
    },
    'submission.dockerfile.instructions.io': {
        en: '2. Your container reads audio from /input and writes restored files, with the same names, to /output.',
        fr: '2. Votre conteneur lit l’audio dans /input et écrit les fichiers restaurés, avec les mêmes noms, dans /output.',
    },
    'submission.dockerfile.instructions.hidden': {
        en: '3. We run it on the test split. You do not upload any audio.',
        fr: '3. Nous l’exécutons sur la partie de test. Vous n’envoyez aucun audio.',
    },
    'submission.dockerfile.downloadTemplate': {
        en: 'Download template',
        fr: 'Télécharger le modèle',
    },
    'submission.dockerfile.file': {
        en: 'Dockerfile · {size} · uploaded {date}',
        fr: 'Dockerfile · {size} · envoyé le {date}',
    },
    'submission.dockerfile.fileShort': {
        en: 'Dockerfile · {size}',
        fr: 'Dockerfile · {size}',
    },
    'submission.dockerfile.noFile': {
        en: 'No Dockerfile',
        fr: 'Aucun Dockerfile',
    },
    'submission.dockerfile.hiddenAudio': {
        en: 'We run your model on the test split. You do not upload any audio.',
        fr: 'Nous exécutons votre modèle sur la partie de test. Vous n’envoyez aucun audio.',
    },

    'submission.modelCard.title': {
        en: 'Model card',
        fr: 'Fiche du modèle',
    },
    'submission.modelCard.empty': {
        en: 'Not provided',
        fr: 'Non renseigné',
    },
    'submission.modelCard.moreFields': {
        en: '{n} more fields',
        fr: '{n} champs de plus',
    },
    'submission.modelCard.fewerFields': {
        en: 'Fewer fields',
        fr: 'Moins de champs',
    },
    'submission.modelCard.termsAgree': {
        en: 'By submitting, you agree to the {terms}.',
        fr: 'En soumettant, vous acceptez les {terms}.',
    },
    'submission.modelCard.termsAccepted': {
        en: 'Submitted under the {terms}.',
        fr: 'Soumise selon les {terms}.',
    },
    'submission.modelCard.terms': {
        en: 'Terms and conditions',
        fr: 'Conditions générales',
    },
    'submission.modelCard.fields.name.label': {
        en: 'Model name',
        fr: 'Nom du modèle',
    },
    'submission.modelCard.fields.name.placeholder': {
        en: 'e.g. WaveMend',
        fr: 'ex. WaveMend',
    },
    'submission.modelCard.fields.authors.label': {
        en: 'Authors',
        fr: 'Auteurs',
    },
    'submission.modelCard.fields.authors.placeholder': {
        en: 'Names and affiliations',
        fr: 'Noms et affiliations',
    },
    'submission.modelCard.fields.architecture.label': {
        en: 'Architecture',
        fr: 'Architecture',
    },
    'submission.modelCard.fields.architecture.placeholder': {
        en: 'e.g. U-Net, transformer',
        fr: 'ex. U-Net, transformer',
    },
    'submission.modelCard.fields.parameters.label': {
        en: 'Parameter count',
        fr: 'Nombre de paramètres',
    },
    'submission.modelCard.fields.parameters.placeholder': {
        en: 'e.g. 42M',
        fr: 'ex. 42M',
    },
    'submission.modelCard.fields.trainingData.label': {
        en: 'Additional training data',
        fr: 'Données d’entraînement supplémentaires',
    },
    'submission.modelCard.fields.trainingData.placeholder': {
        en: 'Data used beyond the OpenRestor train split',
        fr: 'Données utilisées en plus du split train d’OpenRestor',
    },
    'submission.modelCard.fields.codeRepo.label': {
        en: 'Code repo',
        fr: 'Dépôt de code',
    },
    'submission.modelCard.fields.codeRepo.placeholder': {
        en: 'https://',
        fr: 'https://',
    },
    'submission.modelCard.fields.dataRepo.label': {
        en: 'Data repo (weights, training data)',
        fr: 'Dépôt de données (poids, données d’entraînement)',
    },
    'submission.modelCard.fields.dataRepo.placeholder': {
        en: 'https://',
        fr: 'https://',
    },
    'submission.modelCard.fields.paper.label': {
        en: 'Paper (published or upcoming)',
        fr: 'Article (publié ou à paraître)',
    },
    'submission.modelCard.fields.paper.placeholder': {
        en: 'https://',
        fr: 'https://',
    },
    'submission.modelCard.fields.licence.label': {
        en: 'Licence',
        fr: 'Licence',
    },
    'submission.modelCard.fields.licence.placeholder': {
        en: 'Select a licence',
        fr: 'Choisir une licence',
    },

    'submission.scores.listening': {
        en: 'Listening test',
        fr: 'Test d’écoute',
    },
    'submission.scores.pending': {
        en: 'Pending',
        fr: 'En attente',
    },

    'submission.notices.checks_failed.title': {
        en: 'Check failed: {check}',
        fr: 'Vérification échouée : {check}',
    },
    'submission.notices.checks_failed.body': {
        en: 'Fix the problem shown in the checks, then run them again. Fix and resubmit makes the Dockerfile and model card editable.',
        fr: 'Corrigez le problème indiqué dans les vérifications, puis relancez-les. Corriger et resoumettre rend le Dockerfile et la fiche du modèle modifiables.',
    },
    'submission.notices.draft.title': {
        en: 'Before you start',
        fr: 'Avant de commencer',
    },
    'submission.notices.draft.body': {
        en: 'Add your Dockerfile and fill in the model card. The run starts when both are complete.',
        fr: 'Ajoutez votre Dockerfile et remplissez la fiche du modèle. Les vérifications commencent quand les deux sont complets.',
    },
    'submission.notices.checks_running.title': {
        en: 'What happens next',
        fr: 'Et ensuite',
    },
    'submission.notices.checks_running.body': {
        en: 'When all four checks pass, the submission goes to an owner for review. If a check fails, fix it here and start a new run.',
        fr: 'Quand les quatre vérifications réussissent, la soumission passe en revue chez un responsable. Si une vérification échoue, corrigez ici et relancez.',
    },
    'submission.notices.submitted.title': {
        en: 'What happens next',
        fr: 'Et ensuite',
    },
    'submission.notices.submitted.body': {
        en: 'An owner will listen to the audio, read the model card and check these results. Scores are not public until approval.',
        fr: 'Un responsable écoutera l’audio, lira la fiche du modèle et vérifiera ces résultats. Les scores restent privés jusqu’à l’approbation.',
    },
    'submission.notices.in_review.title': {
        en: 'Review in progress',
        fr: 'Revue en cours',
    },
    'submission.notices.in_review.body': {
        en: 'Opened by an owner on {date}. You get an in-app notification when a decision is made. [Expected review time]',
        fr: 'Ouverte par un responsable le {date}. Vous recevez une notification dans l’application quand une décision est prise. [Délai de revue prévu]',
    },
    'submission.notices.approved.title': {
        en: 'Approved on {date}',
        fr: 'Approuvée le {date}',
    },
    'submission.notices.approved.body': {
        en: 'Reviewed by {owner}. Your scores are public and the model is ranked {rank} on the leaderboard.',
        fr: 'Revue par {owner}. Vos scores sont publics et le modèle est classé {rank} au classement.',
    },

    'submission.debug.label': {
        en: 'Debug · step',
        fr: 'Debug · étape',
    },
    'submission.debug.phases.draft': {
        en: 'Draft',
        fr: 'Brouillon',
    },
    'submission.debug.phases.checks_running': {
        en: 'Checks running',
        fr: 'Vérifications en cours',
    },
    'submission.debug.phases.submitted': {
        en: 'Submitted',
        fr: 'Soumise',
    },
    'submission.debug.phases.in_review': {
        en: 'In review',
        fr: 'En revue',
    },
    'submission.debug.phases.approved': {
        en: 'Approved',
        fr: 'Approuvée',
    },
} satisfies Messages;
