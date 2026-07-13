import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

/**
 * Lazily validates and encodes the JWT secret.
 * Throws at *request time* (not build time) if the env var is missing.
 * This ensures the build succeeds while still failing hard in production
 * when the secret is misconfigured.
 */
function getEncodedSecret(): Uint8Array {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error(
            'FATAL: JWT_SECRET environment variable is not set. ' +
            'Add it to .env.local or your deployment environment.'
        );
    }
    return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

/**
 * Produces a SHA-256 hex digest of the raw refresh token UUID.
 * This hash is what gets stored in the database — the raw UUID never persists.
 */
export function hashToken(rawToken: string): string {
    return createHash('sha256').update(rawToken).digest('hex');
}

export async function signAccessToken(payload: object): Promise<string> {
    return new SignJWT(payload as Record<string, unknown>)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('15m') // Short-lived — only used for authenticated API calls
        .sign(getEncodedSecret());
}

export async function verifyAccessToken(token: string): Promise<Record<string, unknown> | null> {
    try {
        const { payload } = await jwtVerify(token, getEncodedSecret());
        return payload as Record<string, unknown>;
    } catch {
        return null;
    }
}

export function generateRefreshToken(): string {
    return uuidv4(); // Opaque UUID — only the SHA-256 hash of this is stored in the DB
}
