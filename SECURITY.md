# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 1.0.0 | ✅ |

## What this skill does NOT do
- No external API calls
- No credential handling or secret storage
- No data exfiltration behavior
- Output is plain Markdown text only

## Reporting a security concern
Report concerns to the repository codeowners through approved internal channels.

## Prompt injection note
Review all skill content before enabling auto-approval for shell/bash tools, consistent with GitHub's guidance for secure use of agent skills.

## Supply chain note
This repository has zero external runtime dependencies; all skill content is static Markdown/plain text.
