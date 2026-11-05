import databaseIcon from 'assets/icons/database-20.svg';
import databaseIconSmall from 'assets/icons/database-18.svg';
import leaderboardIcon from 'assets/icons/leaderboard-20.svg';
import leaderboardIconSmall from 'assets/icons/leaderboard-18.svg';

// Primary navigation destinations. The design only has Datasets and Leaderboard.
// icon: desktop sidebar (20px); iconSmall: mobile bottom bar (18px)
// routes: the routes on which the item shows as active (its own and its sub-pages, which
// are sibling routes in routes.ts, so the router does not count them as inside it)
export const PRIMARY_NAV_ITEMS = [
    {
        route: 'datasets',
        routes: ['datasets'],
        labelKey: 'nav.datasets',
        icon: databaseIcon,
        iconSmall: databaseIconSmall,
    },
    {
        route: 'leaderboard',
        routes: ['leaderboard', 'leaderboard-model'],
        labelKey: 'nav.leaderboard',
        icon: leaderboardIcon,
        iconSmall: leaderboardIconSmall,
    },
] as const;
