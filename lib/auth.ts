import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const SECRET_KEY = process.env.JWT_SECRET || 'secret-key-fallback-change-me'; // User should set this in env
const ENCODED_SECRET = new TextEncoder().encode(SECRET_KEY);

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export async function signAccessToken(payload: any): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('15m') // Short lived
        .sign(ENCODED_SECRET);
}

export async function verifyAccessToken(token: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(token, ENCODED_SECRET);
        return payload;
    } catch (error) {
        return null;
    }
}

export function generateRefreshToken(): string {
    return uuidv4(); // Simple opaque token
}
