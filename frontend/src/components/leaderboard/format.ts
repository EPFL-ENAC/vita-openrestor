// Score and clip formatting shared by the leaderboard and datasets pages

export function formatSnr(value: number): string {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)} dB`;
}

export function formatListening(value: number): string {
    return value.toFixed(2);
}

// Clip length as m:ss
export function formatDuration(seconds: number): string {
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}
