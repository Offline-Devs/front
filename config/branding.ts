import { readFileSync } from "node:fs";

export type BrandConfig = {
  appName: string;
  appShortName: string;
  appDescription: string;
  appVersion: string;
};

const defaults: BrandConfig = {
  appName: "آینده سبز",
  appShortName: "آینده سبز",
  appDescription: "پلتفرم تحلیل عملکرد درسی دانش آموزان کنکوری",
  appVersion: "0.1.0",
};

function parseEnvFile(source: string): Record<string, string> {
  const values: Record<string, string> = {};

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const normalized = line.startsWith("export ") ? line.slice(7).trimStart() : line;
    const separator = normalized.indexOf("=");
    if (separator <= 0) continue;

    const key = normalized.slice(0, separator).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;

    let fileValue = normalized.slice(separator + 1).trim();
    const quote = fileValue[0];
    if ((quote === '"' || quote === "'") && fileValue.endsWith(quote)) {
      fileValue = fileValue.slice(1, -1);
    }
    if (quote === '"') {
      fileValue = fileValue.replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    }

    values[key] = fileValue;
  }

  return values;
}

function readRuntimeEnvFile(): Record<string, string> {
  const filePath = process.env.APP_RUNTIME_ENV_FILE?.trim() || "/app/.env.runtime";
  if (!filePath) return {};

  try {
    return parseEnvFile(readFileSync(/* turbopackIgnore: true */ filePath, "utf8"));
  } catch {
    return {};
  }
}

function value(name: string, fallback: string, runtimeEnv: Record<string, string>) {
  return runtimeEnv[name]?.trim() || process.env[name]?.trim() || fallback;
}

// Read at request runtime, not at Docker image build time.
export function getBrandConfig(): BrandConfig {
  const runtimeEnv = readRuntimeEnvFile();

  return {
    appName: value("NEXT_PUBLIC_APP_NAME", defaults.appName, runtimeEnv),
    appShortName: value("NEXT_PUBLIC_APP_SHORT_NAME", defaults.appShortName, runtimeEnv),
    appDescription: value("NEXT_PUBLIC_APP_DESCRIPTION", defaults.appDescription, runtimeEnv),
    appVersion: value("NEXT_PUBLIC_APP_VERSION", defaults.appVersion, runtimeEnv),
  };
}
