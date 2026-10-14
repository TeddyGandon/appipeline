# Changelog

All notable changes to this project are documented in this file. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.1.0] - 2026-10-14

First public release.

### Added

- One-page A4 resume template with a tailoring guide for AI agents, and a fictional sample candidate.
- Prompt templates for a tailored resume, a cover letter and an application email (`prompts/`).
- `Job offer` issue form and workflow: generates, exports and commits the documents of a job
  offer with GitHub Copilot CLI.
- `build-prompt` script: fills a prompt template with the fields of a job offer issue.
- `export-pdf` script: exports a `*.pdf.html` page to PDF, with a `--strict` one-page check.
- Optional `PORTFOLIO_SITEMAP` and `COPILOT_MODEL` repository variables.
- Unit tests, spelling check and CI workflow.

[Unreleased]: https://github.com/teddygandon/appipeline/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/teddygandon/appipeline/releases/tag/v0.1.0
