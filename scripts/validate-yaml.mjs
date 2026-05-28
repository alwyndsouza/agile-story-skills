import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import YAML from "yaml";

const ignoredDirs = new Set([".git", ".claude", "node_modules"]);

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (ignoredDirs.has(entry)) continue;
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      walk(path, files);
    } else if (path.endsWith(".yaml") || path.endsWith(".yml")) {
      files.push(path);
    }
  }
  return files;
}

let failed = false;
for (const file of walk(".")) {
  try {
    YAML.parse(readFileSync(file, "utf8"));
    console.log(`ok ${file}`);
  } catch (error) {
    failed = true;
    console.error(`YAML parse failed: ${file}`);
    console.error(error.message);
  }
}

if (!existsSync(".github/workflows/quality.yml")) {
  failed = true;
  console.error("Missing .github/workflows/quality.yml");
}

process.exit(failed ? 1 : 0);
