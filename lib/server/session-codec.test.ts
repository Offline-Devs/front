// @vitest-environment node

import { describe, expect, it } from "vitest";
import { userFixture } from "@/mocks/fixtures";
import { decodeSession, encodeSession, type ServerSession } from "./session-codec";

const session: ServerSession = { accessToken: "access-secret", refreshToken: "refresh-secret", accessExpiresAt: Date.now() + 60_000, user: userFixture };
const secret = "a-secure-test-secret-with-more-than-32-characters";

describe("encrypted session codec", () => {
  it("round-trips a valid session without exposing token text", async () => { const encoded = await encodeSession(session, secret, 60); expect(encoded).not.toContain(session.accessToken); expect(encoded).not.toContain(session.refreshToken); expect(await decodeSession(encoded, secret)).toEqual(session); });
  it("rejects a modified or wrongly signed cookie", async () => {
    const encoded = await encodeSession(session, secret, 60);
    const parts = encoded.split(".");
    const ciphertext = parts[3]!;
    parts[3] = `${ciphertext[0] === "A" ? "B" : "A"}${ciphertext.slice(1)}`;

    expect(await decodeSession(parts.join("."), secret)).toBeNull();
    expect(
      await decodeSession(
        encoded,
        "another-secret-with-more-than-32-characters",
      ),
    ).toBeNull();
  });
});
