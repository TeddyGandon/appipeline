# Security policy

## Reporting a vulnerability

Please do not open a public issue. Report it privately with
[GitHub private vulnerability reporting](https://github.com/teddygandon/appipeline/security/advisories/new).
You should get a first answer within a week.

## Threat model of the `Job offer` workflow

The [`Job offer` workflow](.github/workflows/job-offer.yml) runs GitHub Copilot CLI with
**all its tools allowed** (shell commands, file edits, web access), on a prompt that embeds text
pasted from a job offer. That text is untrusted: a job offer can hide instructions aimed at AI
agents (prompt injection). The workflow limits the risks as follows:

- **Only the repository owner can trigger it.** Both jobs check
  `github.actor == github.repository_owner`, for the `issues` and the `workflow_dispatch`
  triggers. Do not remove this check: anyone able to open an issue could otherwise run commands on
  the runner, with write access to the repository.
- **The agent cannot push.** `git commit` and `git push` are denied to Copilot; the workflow
  commits a single expected file itself, after the agent has finished.
- **Scoped credentials.** The `GITHUB_TOKEN` only has the `contents: write` and `issues: write`
  permissions. The `COPILOT_GITHUB_TOKEN` secret should be a fine-grained token with the
  **Copilot Requests** permission only.

Remaining risks you accept by running the workflow: an injected instruction could make the agent
write misleading content into a document, or send the content of the repository (your resume) to
an outside server. **Review every generated document before using it**, and only paste job offers
from sources you trust.

## Personal data

Your copy of Appipeline holds your resume and your applications: keep it in a **private**
repository.
