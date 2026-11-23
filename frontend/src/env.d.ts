declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: string;
        VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
        VUE_ROUTER_BASE: string | undefined;
    }
}

// Intl.DurationFormat (ES2025) is missing from TypeScript 5.9's lib. Only the parts the app uses.
// Delete this block when TypeScript ships the types.
declare namespace Intl {
    interface DurationFormatOptions {
        style?: 'long' | 'short' | 'narrow' | 'digital';
        hoursDisplay?: 'always' | 'auto';
    }

    interface DurationInput {
        hours?: number;
        minutes?: number;
        seconds?: number;
    }

    class DurationFormat {
        constructor(locales?: string | string[], options?: DurationFormatOptions);
        format(duration: DurationInput): string;
    }
}
