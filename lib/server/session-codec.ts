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
