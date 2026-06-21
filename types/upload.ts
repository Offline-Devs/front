// Describes single and batch upload responses. Relative URLs are resolved through the same-origin BFF so the browser never needs direct backend network access.
export type UploadKind = "profile" | "document";
export type UploadResponse = { url: string; filename: string; size: number };
