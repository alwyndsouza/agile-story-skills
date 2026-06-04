import { readFileSync } from "node:fs";
import YAML from "yaml";

const manifest = JSON.parse(readFileSync("skills.json", "utf8"));
const evalFiles = (manifest.skills ?? []).map((skill) => `evals/${skill.id}.yaml`);

let failed = false;

for (const file of evalFiles) {
  const config = YAML.parse(readFileSync(file, "utf8"));
  const tests = config.tests ?? [];
  const count = tests.length;

  if (count < 8 || count > 12) {
    failed = true;
    console.error(`${file}: expected 8-12 tests, found ${count}`);
  }

  if (!config.providers?.[0]?.id?.includes("EVAL_MODEL")) {
    failed = true;
    console.error(`${file}: provider must use {{env.EVAL_MODEL}}`);
  }

  if (!config.defaultTest?.options?.provider?.includes("EVAL_MODEL")) {
    failed = true;
    console.error(`${file}: defaultTest.options.provider must use {{env.EVAL_MODEL}}`);
  }

  const descriptions = new Set();
  for (const test of tests) {
    if (!test.description) {
      failed = true;
      console.error(`${file}: test missing description`);
      continue;
    }
    if (descriptions.has(test.description)) {
      failed = true;
      console.error(`${file}: duplicate test description: ${test.description}`);
    }
    descriptions.add(test.description);
  }

  console.log(`ok ${file}: ${count} tests`);
}

process.exit(failed ? 1 : 0);
