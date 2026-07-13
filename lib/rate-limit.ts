/**
 * Simple in-memory rate limiter for login attempts.
 *
 * NOTE: Because Vercel deploys serverless functions, each cold-start gets a
 * fresh Map. This still protects against rapid bursts within a single warm
 * instance. For persistent, cross-instance rate limiting, replace the Map
 * with Vercel KV (upstash/ratelimit) or a Redis store.
 */

interface RateLimitEntry {
    count: number;
    resetAt: number; // Unix timestamp ms
}

const store = new Map<string, RateLimitEntry>();

const MAX_ATTEMPTS = 5;          // Max failed attempts allowed
const WINDOW_MS = 15 * 60 * 1000; // 15-minute sliding window

/**
 * Returns true if the IP is allowed to proceed, false if it should be blocked.
 * Call this AFTER a failed login — only failed attempts are counted.
 */
export function recordFailedAttempt(ip: string): { allowed: boolean; retryAfterSeconds: number } {
    const now = Date.now();
    const entry = store.get(ip);

    if (!entry || now > entry.resetAt) {
        // First failure or window expired — start a fresh window
        store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
        return { allowed: true, retryAfterSeconds: 0 };
    }

    entry.count += 1;

    if (entry.count > MAX_ATTEMPTS) {
        const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
        return { allowed: false, retryAfterSeconds };
    }

    return { allowed: true, retryAfterSeconds: 0 };
}

/** Call on successful login to clear the failure counter for this IP. */
export function clearAttempts(ip: string): void {
    store.delete(ip);
}

/** Check current block status WITHOUT incrementing the counter. */
export function isBlocked(ip: string): { blocked: boolean; retryAfterSeconds: number } {
    const now = Date.now();
    const entry = store.get(ip);

    if (!entry || now > entry.resetAt) return { blocked: false, retryAfterSeconds: 0 };

    if (entry.count >= MAX_ATTEMPTS) {
        const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
        return { blocked: true, retryAfterSeconds };
    }

    return { blocked: false, retryAfterSeconds: 0 };
}
