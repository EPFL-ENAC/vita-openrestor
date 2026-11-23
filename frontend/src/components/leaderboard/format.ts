// Score and clip formatting shared by the leaderboard and datasets pages

export function formatSnr(value: number): string {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)} dB`;
}

export function formatListening(value: number): string {
    return value.toFixed(2);
}

// Clip length as mm:ss. DurationFormat only takes whole numbers, so the length is rounded first.
export function formatDuration(seconds: number, locale: string): string {
    const total = Math.round(seconds);
    return new Intl.DurationFormat(locale, { style: 'digital', hoursDisplay: 'auto' }).format({
        minutes: Math.floor(total / 60),
        seconds: total % 60,
    });
}
