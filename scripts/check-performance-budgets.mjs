import { gzipSync } from "node:zlib";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const root = process.cwd();
const limits = {
  initialJsGzip: Number(process.env.PERF_MAX_INITIAL_JS_GZIP_KB ?? 420) * 1024,
  image: Number(process.env.PERF_MAX_IMAGE_KB ?? 250) * 1024,
  fonts: Number(process.env.PERF_MAX_TOTAL_FONT_KB ?? 250) * 1024,
};
const failures = [];
const manifestPath = join(root, ".next", "build-manifest.json");
if (!existsSync(manifestPath))
  throw new Error("Run next build before checking performance budgets.");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const initialFiles = new Set(
  [
    ...(manifest.rootMainFiles ?? []),
    ...(manifest.pages?.["/_app"] ?? []),
    ...(manifest.pages?.["/"] ?? []),
  ].filter((file) => file.endsWith(".js")),
);
const initialJsGzip = [...initialFiles].reduce(
  (total, file) => total + gzipSync(readFileSync(join(root, ".next", file))).byteLength,
  0,
);
if (initialJsGzip > limits.initialJsGzip)
  failures.push(
    `initial JS ${Math.ceil(initialJsGzip / 1024)}KB > ${limits.initialJsGzip / 1024}KB gzip`,
  );

function walk(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)],
  );
}
const assets = walk(join(root, "public"));
for (const file of assets.filter((item) =>
  [".png", ".jpg", ".jpeg", ".webp", ".avif"].includes(extname(item).toLowerCase()),
)) {
  const size = statSync(file).size;
  if (size > limits.image)
    failures.push(
      `${file.replace(root, "")} image ${Math.ceil(size / 1024)}KB > ${limits.image / 1024}KB`,
    );
}
const fontBytes = assets
  .filter((item) => [".woff2", ".woff", ".ttf"].includes(extname(item).toLowerCase()))
  .reduce((total, file) => total + statSync(file).size, 0);
if (fontBytes > limits.fonts)
  failures.push(`fonts ${Math.ceil(fontBytes / 1024)}KB > ${limits.fonts / 1024}KB total`);

if (failures.length) {
  console.error(`Performance budget failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log(
  `Performance budgets passed: initial JS ${Math.ceil(initialJsGzip / 1024)}KB gzip; fonts ${Math.ceil(fontBytes / 1024)}KB.`,
);
