/**
 * @file lib/server/session-codec.ts
 * @description JWE encode/decode functions for the BFF session cookie payload.
 *
 * Uses the jose library's EncryptJWT / jwtDecrypt with the A256GCM algorithm
 * (AES-256 GCM, a symmetric authenticated encryption scheme). The encryption
 * key is derived from the BFF_SESSION_SECRET environment variable via SHA-256.
 *
 * encodeSession(session, secret, maxAgeSeconds) — encrypts the session object
 *   into a compact JWE string suitable for cookie storage. Sets iat and exp claims.
 *
 * decodeSession(value, secret) — decrypts and validates the JWE string.
 *   Returns the typed ServerSession or null on any decryption / validation error
 *   (tampered cookie, wrong key, expired token).
 *
 * ServerSession type — the canonical shape of data kept in the cookie:
 *   accessToken, refreshToken, accessExpiresAt (Unix ms), and user (User object).
 */
import { EncryptJWT, jwtDecrypt } from "jose";
import type { User } from "@/types/student";

export type ServerSession = {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: number;
  user: User;
};

async function deriveKey(secret: string) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret)));
}

// JWE keeps both tokens and user claims confidential and tamper-resistant inside the cookie.
export async function encodeSession(session: ServerSession, secret: string, maxAgeSeconds: number) {
  return new EncryptJWT(session)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(`${maxAgeSeconds}s`)
    .encrypt(await deriveKey(secret));
}

export async function decodeSession(value: string, secret: string): Promise<ServerSession | null> {
  try {
    const { payload } = await jwtDecrypt(value, await deriveKey(secret));
    if (
      typeof payload.accessToken !== "string" ||
      typeof payload.refreshToken !== "string" ||
      typeof payload.accessExpiresAt !== "number" ||
      typeof payload.user !== "object" ||
      !payload.user
    )
      return null;
    return {
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      accessExpiresAt: payload.accessExpiresAt,
      user: payload.user as User,
    };
  } catch {
    return null;
  }
}
