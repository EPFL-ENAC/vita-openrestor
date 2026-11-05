import type { Messages } from './types';

// App shell, shared by every page: navigation, sidebar, player, account, page titles. One entry per key, English and French side by side.
export const commonMessages = {
    appTitle: {
        en: 'OpenRestor',
        fr: 'OpenRestor',
    },

    notFoundMessage: {
        en: 'Oops. Nothing here...',
        fr: "Oups. Il n'y a rien ici...",
    },

    goHome: {
        en: 'Go home',
        fr: "Retour à l'accueil",
    },

    'nav.primary': {
        en: 'Primary navigation',
        fr: 'Navigation principale',
    },

    'nav.datasets': {
        en: 'Datasets',
        fr: 'Jeux de données',
    },

    'nav.leaderboard': {
        en: 'Leaderboard',
        fr: 'Classement',
    },

    'library.mySubmissions': {
        en: 'My submissions',
        fr: 'Mes soumissions',
    },

    'library.submitModel': {
        en: 'Submit a model',
        fr: 'Soumettre un modèle',
    },

    'library.submittedOn': {
        en: 'submitted {date}',
        fr: 'soumis le {date}',
    },

    'library.noSubmissions': {
        en: 'No submissions yet.',
        fr: 'Aucune soumission pour le moment.',
    },

    'library.status.draft': {
        en: 'Draft',
        fr: 'Brouillon',
    },
    'library.status.checks_running': {
        en: 'Checks running',
        fr: 'Vérifications en cours',
    },
    'library.status.checks_failed': {
        en: 'Checks failed',
        fr: 'Vérifications échouées',
    },
    'library.status.submitted': {
        en: 'Submitted',
        fr: 'Soumis',
    },
    'library.status.in_review': {
        en: 'In review',
        fr: 'En revue',
    },
    'library.status.approved': {
        en: 'Approved',
        fr: 'Approuvé',
    },
    'library.status.rejected': {
        en: 'Rejected',
        fr: 'Refusé',
    },

    'library.hints.fixAndResubmit': {
        en: 'fix and resubmit',
        fr: 'corriger et resoumettre',
    },
    'library.hints.notSubmitted': {
        en: 'not submitted yet',
        fr: 'pas encore soumis',
    },

    'tracks.label': {
        en: 'Dataset track',
        fr: 'Piste du jeu de données',
    },

    'header.search': {
        en: 'Search',
        fr: 'Rechercher',
    },

    'account.menu': {
        en: 'Account and language',
        fr: 'Compte et langue',
    },

    'player.nothingPlaying': {
        en: 'Nothing playing',
        fr: 'Aucune lecture',
    },

    'player.addFiles': {
        en: 'Add files to preview them here',
        fr: 'Ajoutez des fichiers pour les écouter ici',
    },

    'player.play': {
        en: 'Play',
        fr: 'Lire',
    },

    'player.pause': {
        en: 'Pause',
        fr: 'Pause',
    },

    'player.mute': {
        en: 'Mute',
        fr: 'Couper le son',
    },

    'player.unmute': {
        en: 'Unmute',
        fr: 'Rétablir le son',
    },

    'player.seek': {
        en: 'Playback position',
        fr: 'Position de lecture',
    },

    'player.position': {
        en: '{current} of {total}',
        fr: '{current} sur {total}',
    },

    'player.version': {
        en: 'Audio version',
        fr: 'Version audio',
    },

    'player.versions.original': {
        en: 'Original',
        fr: 'Original',
    },
    'player.versions.degraded': {
        en: 'Degraded',
        fr: 'Dégradé',
    },
    'player.versions.restored': {
        en: 'Restored',
        fr: 'Restauré',
    },

    'pages.leaderboard.title': {
        en: 'Leaderboard',
        fr: 'Classement',
    },

    'pages.datasets.title': {
        en: 'Datasets',
        fr: 'Jeux de données',
    },

    'pages.submission.title': {
        en: 'Submission',
        fr: 'Soumission',
    },

    'language.label': {
        en: 'Language',
        fr: 'Langue',
    },

    'language.english': {
        en: 'English',
        fr: 'English',
    },

    'language.french': {
        en: 'Français',
        fr: 'Français',
    },

    'auth.signinTitle': {
        en: 'Sign in to OpenRestor',
        fr: 'Connexion à OpenRestor',
    },

    'auth.signinSubtitle': {
        en: '',
        fr: '',
    },

    'auth.signin': {
        en: 'Sign in',
        fr: 'Se connecter',
    },

    'auth.logout': {
        en: 'Sign out',
        fr: 'Se déconnecter',
    },
} satisfies Messages;
