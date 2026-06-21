// پاسخ upload تکی و چندتایی؛ URL نسبی باید با origin بک‌اند resolve شود.
export type UploadKind = "profile" | "document";
export type UploadResponse = { url: string; filename: string; size: number };
