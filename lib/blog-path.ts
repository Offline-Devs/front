function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function blogPostPath(slug: string) {
  const cleanSlug = safeDecode(slug)
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map(encodeURIComponent)
    .join("/");

  return cleanSlug ? `/blog/${cleanSlug}` : "/blog";
}
