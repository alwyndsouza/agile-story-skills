# Contributing

This repo ships four GitHub Copilot Agent Skills — `agile-story-writer`,
`agile-story-splitter`, `problem-framing`, and `sprint-goal-writer`. Contributions are
welcome against any of them.

## Who can contribute
Team members can contribute via pull requests. Every PR requires review from a configured
codeowner before merge.

## Contributions we welcome

Per skill:

| Skill | Welcomed contributions |
|---|---|
| `agile-story-writer` | New personas in `references/personas.md`; new banned-phrase / better-alternative rows in `references/story-format-guide.md`; additional good / bad example stories. |
| `agile-story-splitter` | New domain examples for any of the eight Humanizing Work patterns; sharpened pitfall guidance; improved INVEST validation copy. |
| `problem-framing` | Better question phrasings for any of the eight canvas questions; additional context-dump heuristics; new worked examples. |
| `sprint-goal-writer` | New anti-patterns with bad / better pairs; refinements to the health-check checklist; additional worked examples covering non-data domains. |

Cross-cutting:

- Trigger keyword coverage in any `SKILL.md` description or `applyTo` pattern
- Invoke-mode improvements
- Bug fixes in quality rules, formatting guidance, or `quality.yml`
- Doc fixes in `README.md`, `CHANGELOG.md`, or `docs/`

## How to contribute
1. Fork this repository.
2. Create a branch for your change.
3. Make focused updates — touch one skill per PR where possible.
4. Test with Copilot Chat and collect prompt/output evidence.
5. Open a pull request using the PR template.

## Branch naming convention
Use one of these prefixes:
- `feat/`
- `fix/`
- `docs/`
- `chore/`

## PR title convention

Use Conventional Commit style:
- `feat(scope): add new capability`
- `fix(scope): correct broken behavior`
- `docs(scope): update documentation`
- `chore(scope): maintain tooling or repo hygiene`

## PR requirements
- CI must pass (`quality.yml`) across every changed skill.
- `CHANGELOG.md` must be updated.
- Tested Copilot output must be pasted in the PR description.

## Changes that require codeowner approval before merge

These are core constructs that other skills, downstream consumers, or worked examples
depend on. Touching them needs explicit codeowner sign-off.

| Area | Examples |
|---|---|
| `agile-story-writer` core | GIVEN/WHEN/THEN AC format, Definition of Ready / Definition of Done checklists, Fibonacci story-point scale, AGILE STORY box format |
| `agile-story-splitter` core | The eight Humanizing Work pattern set or the INVEST validation table |
| `problem-framing` core | The three-phase / eight-question canvas structure or the refined problem-statement template |
| `sprint-goal-writer` core | The sprint-goal sentence template or the five-item health-check checklist |
| Shared | `SKILL.md` frontmatter fields (`name`, `description`, `argument-hint`, `applyTo`, `user-invocable`, `disable-model-invocation`, `context`, `allowed-tools`); `scripts/validate-skills.mjs` required-files list |
