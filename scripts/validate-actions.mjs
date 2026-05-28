import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createLinter } from "actionlint";

const workflowsDir = ".github/workflows";
const files = readdirSync(workflowsDir)
  .filter((file) => file.endsWith(".yml") || file.endsWith(".yaml"))
  .map((file) => join(workflowsDir, file));

const lint = await createLinter();
let failed = false;

for (const file of files) {
  const results = lint(readFileSync(file, "utf8"), file);
  if (results.length === 0) {
    console.log(`ok ${file}`);
    continue;
  }

  failed = true;
  for (const result of results) {
    console.error(
      `${result.file}:${result.line}:${result.column} ${result.kind}: ${result.message}`
    );
  }
}

process.exit(failed ? 1 : 0);
