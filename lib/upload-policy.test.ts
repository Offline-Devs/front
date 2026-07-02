/**
 * @file lib/upload-policy.test.ts
 * @description Unit tests for client-side upload file validation.
 *
 * Verifies validateUploadFiles() rejects files exceeding the size limit,
 * files with disallowed MIME types, and counts exceeding maxFiles, while
 * accepting valid files within all constraints.
 */
import { describe, expect, it } from "vitest";
import { PROFILE_IMAGE_TYPES, validateFileSignatures, validateUploadFiles } from "./upload-policy";

const mb = 1024 * 1024;
describe("upload policy", () => {
  it("accepts an allowed profile image", () =>
    expect(
      validateUploadFiles([{ type: "image/webp", size: mb }], {
        mimeTypes: PROFILE_IMAGE_TYPES,
        maxBytes: 2 * mb,
        maxFiles: 1,
      }),
    ).toBeNull());
  it("rejects disguised and oversized files", () => {
    expect(
      validateUploadFiles([{ type: "image/svg+xml", size: 10 }], {
        mimeTypes: PROFILE_IMAGE_TYPES,
        maxBytes: mb,
        maxFiles: 1,
      }),
    ).toMatch(/نوع/);
    expect(
      validateUploadFiles([{ type: "application/x-zip-compressed", size: 2 * mb }], {
        maxBytes: mb,
        maxFiles: 1,
      }),
    ).toMatch(/حجم/);
  });
  it("enforces file count", () =>
    expect(
      validateUploadFiles(
        [
          { type: "application/pdf", size: 10 },
          { type: "application/pdf", size: 10 },
        ],
        { maxBytes: mb, maxFiles: 1 },
      ),
    ).toMatch(/تعداد/));
  it("allows arbitrary document MIME types when no MIME policy is provided", () =>
    expect(
      validateUploadFiles([{ type: "application/x-msdownload", size: 10 }], {
        maxBytes: mb,
        maxFiles: 1,
      }),
    ).toBeNull());
  it("checks file signatures instead of trusting MIME metadata", async () => {
    expect(
      await validateFileSignatures([
        new File(["%PDF-1.7"], "safe.pdf", { type: "application/pdf" }),
      ]),
    ).toBeNull();
    expect(
      await validateFileSignatures([
        new File(["<script>"], "fake.pdf", { type: "application/pdf" }),
      ]),
    ).toMatch(/محتوای/);
  });
});
