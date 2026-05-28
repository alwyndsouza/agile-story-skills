import { existsSync, readFileSync } from "node:fs";
import YAML from "yaml";

const manifest = JSON.parse(readFileSync("skills.json", "utf8"));
const requiredFiles = [
  ".github/skills/agile-story-writer/SKILL.md",
  ".github/skills/agile-story-writer/examples/good-story.md",
  ".github/skills/agile-story-writer/examples/bad-story.md",
  ".github/skills/agile-story-writer/references/personas.md",
  ".github/skills/agile-story-writer/references/story-format-guide.md",
  ".github/skills/agile-story-writer/assets/story-template.txt",
  ".github/skills/agile-story-splitter/SKILL.md",
  ".github/skills/agile-story-splitter/examples/split-example.md",
  ".github/skills/agile-story-splitter/references/split-patterns.md",
  ".github/skills/problem-framing/SKILL.md",
  ".github/skills/problem-framing/examples/framing-example.md",
  ".github/skills/problem-framing/assets/canvas-template.md",
  ".github/skills/sprint-goal-writer/SKILL.md",
  ".github/skills/sprint-goal-writer/examples/goal-example.md",
  ".github/skills/sprint-goal-writer/assets/goal-template.md"
];

let failed = false;

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    failed = true;
    console.error(`Missing required file: ${file}`);
  }
}

const ids = new Set();
for (const skill of manifest.skills ?? []) {
  if (ids.has(skill.id)) {
    failed = true;
    console.error(`Duplicate skill id in skills.json: ${skill.id}`);
  }
  ids.add(skill.id);

  if (!existsSync(skill.path)) {
    failed = true;
    console.error(`skills.json path does not exist: ${skill.path}`);
    continue;
  }

  const content = readFileSync(skill.path, "utf8");
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    failed = true;
    console.error(`${skill.path}: missing YAML frontmatter`);
    continue;
  }

  const frontmatter = YAML.parse(frontmatterMatch[1]);
  for (const field of ["name", "description", "license", "metadata"]) {
    if (!frontmatter?.[field]) {
      failed = true;
      console.error(`${skill.path}: missing frontmatter field ${field}`);
    }
  }

  if (frontmatter?.name !== skill.id) {
    failed = true;
    console.error(`${skill.path}: frontmatter name must match skills.json id ${skill.id}`);
  }

  if (frontmatter?.metadata?.version !== manifest.version) {
    failed = true;
    console.error(
      `${skill.path}: version ${frontmatter?.metadata?.version} does not match skills.json ${manifest.version}`
    );
  }
}

console.log(`ok skills.json: ${ids.size} skills`);
process.exit(failed ? 1 : 0);
