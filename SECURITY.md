# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 1.1.x | ✅ |
| 1.0.x | ❌ (superseded — paths referenced the old `jira-story-writer` skill name) |

## What these skills do NOT do
- No external API calls
- No credential handling or secret storage
- No data exfiltration behavior
- Output is plain Markdown text only

## Reporting a security concern
Report concerns to the repository codeowners through approved internal channels.

## Prompt injection note
Review all skill content before enabling auto-approval for shell/bash tools, consistent with GitHub's guidance for secure use of agent skills.

## Supply chain note
The skills themselves have no runtime dependencies and make no external calls. Local and
CI quality checks use pinned Node development dependencies in `package-lock.json`.
