/**
 * @file lib/server/session.ts
 * @description Server-only helpers for reading, writing, and clearing the BFF session cookie.
 *
 * Session data (access token, refresh token, expiry, user) is encrypted
 * into a JWE (JSON Web Encryption) token by session-codec.ts and stored in
 * a single HttpOnly cookie so the browser never accesses tokens directly.
 *
 * readSession()          — decodes and returns the session from the cookie, or
 *                          null when absent or expired.
 * writeSession(session)  — encodes the session and sets the cookie with the
 *                          configured HttpOnly / Secure / SameSite options.
 * clearSession()         — overwrites the cookie with an empty value and maxAge=0
 *                          to immediately invalidate the session.
 *
 * Cookie options (name, domain, secure, sameSite, maxAge) come from
 * config/server-env.ts and can be overridden via environment variables.
 */
import "server-only";

import { cookies } from "next/headers";
import { serverEnv } from "@/config/server-env";
import { decodeSession, encodeSession, type ServerSession } from "./session-codec";

const cookieOptions = {
  httpOnly: true,
  secure: serverEnv.session.cookieSecure,
  sameSite: serverEnv.session.cookieSameSite,
  path: "/",
  maxAge: serverEnv.session.maxAgeSeconds,
  priority: "high" as const,
  ...(serverEnv.session.cookieDomain ? { domain: serverEnv.session.cookieDomain } : {}),
};

export async function readSession() {
  const value = (await cookies()).get(serverEnv.session.cookieName)?.value;
  return value ? decodeSession(value, serverEnv.session.secret) : null;
}
export async function writeSession(session: ServerSession) {
  (await cookies()).set(
    serverEnv.session.cookieName,
    await encodeSession(session, serverEnv.session.secret, serverEnv.session.maxAgeSeconds),
    cookieOptions,
  );
}
export async function clearSession() {
  (await cookies()).set(serverEnv.session.cookieName, "", { ...cookieOptions, maxAge: 0 });
}
