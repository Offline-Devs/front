import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const standalone = join(root, ".next", "standalone");
if (!existsSync(join(standalone, "server.js"))) throw new Error("Production output is missing. Run `npm run build` first.");

// A Docker image copies these assets in separate layers. This local production launcher mirrors that layout before starting the generated standalone server.
cpSync(join(root, "public"), join(standalone, "public"), { recursive: true, force: true });
mkdirSync(join(standalone, ".next"), { recursive: true });
cpSync(join(root, ".next", "static"), join(standalone, ".next", "static"), { recursive: true, force: true });
process.chdir(standalone);
await import(pathToFileURL(join(standalone, "server.js")).href);
