import "server-only";

import { cookies } from "next/headers";
import { serverEnv } from "@/config/server-env";
import { decodeSession, encodeSession, type ServerSession } from "./session-codec";

const cookieOptions = { httpOnly: true, secure: serverEnv.session.cookieSecure, sameSite: serverEnv.session.cookieSameSite, path: "/", maxAge: serverEnv.session.maxAgeSeconds, priority: "high" as const, ...(serverEnv.session.cookieDomain ? { domain: serverEnv.session.cookieDomain } : {}) };

export async function readSession() { const value = (await cookies()).get(serverEnv.session.cookieName)?.value; return value ? decodeSession(value, serverEnv.session.secret) : null; }
export async function writeSession(session: ServerSession) { (await cookies()).set(serverEnv.session.cookieName, await encodeSession(session, serverEnv.session.secret, serverEnv.session.maxAgeSeconds), cookieOptions); }
export async function clearSession() { (await cookies()).set(serverEnv.session.cookieName, "", { ...cookieOptions, maxAge: 0 }); }
