/**
 * @file lib/upload-policy.ts
 * @description Client-side file upload validation policy.
 *
 * PROFILE_IMAGE_TYPES — accepted MIME types for profile photos (JPEG, PNG, WebP).
 * DOCUMENT_TYPES — accepted MIME types for performance report attachments;
 *   extends profile image types with application/pdf.
 *
 * validateUploadFiles(files, policy) — checks file count, individual MIME type,
 *   and individual byte size against the provided policy. Returns a user-facing
 *   Persian error string or null on success. Used in both the BFF proxy
 *   (server-side pre-validation) and the FileUploader component (client-side UX).
 *
 * validateFileSignatures(files) — reads the first 12 bytes of each file and
 *   verifies the magic-byte signature matches the declared MIME type. Prevents
 *   MIME-type spoofing. Used in the BFF proxy only (requires ArrayBuffer access).
 */
export const PROFILE_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const DOCUMENT_TYPES = [...PROFILE_IMAGE_TYPES, "application/pdf"] as const;

type UploadPolicy = { maxBytes: number; maxFiles: number; mimeTypes: readonly string[] };

export function validateUploadFiles(
  files: Array<Pick<File, "size" | "type">>,
  policy: UploadPolicy,
): string | null {
  if (!files.length) return "حداقل یک فایل الزامی است.";
  if (files.length > policy.maxFiles) return "تعداد فایل‌ها بیشتر از حد مجاز است.";
  for (const file of files) {
    if (!policy.mimeTypes.includes(file.type)) return "نوع فایل مجاز نیست.";
    if (file.size <= 0 || file.size > policy.maxBytes) return "حجم فایل خارج از محدوده مجاز است.";
  }
  return null;
}

export async function validateFileSignatures(
  files: Array<Pick<File, "type" | "slice">>,
): Promise<string | null> {
  for (const file of files) {
    const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    const valid =
      file.type === "image/jpeg"
        ? bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
        : file.type === "image/png"
          ? [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every(
              (value, index) => bytes[index] === value,
            )
          : file.type === "image/webp"
            ? String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
              String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
            : file.type === "application/pdf"
              ? String.fromCharCode(...bytes.slice(0, 5)) === "%PDF-"
              : false;
    if (!valid) return "محتوای فایل با نوع اعلام‌شده سازگار نیست.";
  }
  return null;
}
