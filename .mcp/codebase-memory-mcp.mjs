#!/usr/bin/env node

import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const projectId = createHash("sha256")
  .update(projectRoot)
  .digest("hex")
  .slice(0, 12);
const cacheDir = path.join(
  os.homedir(),
  ".codex",
  "mcp",
  "cache",
  `project-${projectId}`,
);
const runtimeDir = path.join(
  os.homedir(),
  ".codex",
  "mcp",
  "runtime",
  `project-${projectId}`,
);
const configPath = path.join(cacheDir, "_config.db");
const seedConfigPath = path.join(
  os.homedir(),
  ".cache",
  "codebase-memory-mcp",
  "_config.db",
);
const npmBin = path.join(
  projectRoot,
  "node_modules",
  "codebase-memory-mcp",
  "bin.js",
);

if (!fs.existsSync(npmBin)) {
  console.error(
    "codebase-memory-mcp is not installed. Run `npm install` in the project root.",
  );
  process.exit(1);
}

fs.mkdirSync(cacheDir, { recursive: true });
fs.mkdirSync(runtimeDir, { recursive: true });

if (!fs.existsSync(configPath) && fs.existsSync(seedConfigPath)) {
  fs.copyFileSync(seedConfigPath, configPath);
}

const child = spawn(process.execPath, [npmBin, ...process.argv.slice(2)], {
  cwd: projectRoot,
  env: {
    ...process.env,
    ...(fs.existsSync(configPath) ? { CBM_CACHE_DIR: cacheDir } : {}),
    CBM_MEM_BUDGET_MB: "2048",
    CBM_STARTUP_TIMEOUT_MS: "120000",
    CBM_RUNTIME_DIR: runtimeDir,
  },
  stdio: "inherit",
  windowsHide: true,
});

child.once("error", (error) => {
  console.error(`Failed to start codebase-memory-mcp: ${error.message}`);
  process.exitCode = 1;
});

child.once("exit", (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0);
});
