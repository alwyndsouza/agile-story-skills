# Contributing

## Who can contribute
Team members can contribute via pull requests. Every PR requires review from a configured codeowner before merge.

## Contributions we welcome
- New personas in `references/personas.md`
- Invoke mode improvements and trigger coverage updates
- Additional example stories (good and anti-pattern references)
- Bug fixes in quality rules, formatting guidance, and validation workflow

## How to contribute
1. Fork this repository.
2. Create a branch for your change.
3. Make focused updates.
4. Test with Copilot Chat and collect prompt/output evidence.
5. Open a pull request using the PR template.

## Branch naming convention
Use one of these prefixes:
- `feat/`
- `fix/`
- `docs/`

## PR requirements
- CI must pass (`validate-skill.yml`).
- `CHANGELOG.md` must be updated.
- Tested Copilot output must be pasted in the PR description.

## Changes that require codeowner approval before merge
- Core GIVEN/WHEN/THEN format
- Definition of Ready and Definition of Done checklists
- Fibonacci story point scale
- `SKILL.md` frontmatter fields
