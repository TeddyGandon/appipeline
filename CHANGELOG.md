# Changelog

All notable changes to this project are documented in this file. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-10-14

A first release of Appipeline: turn a job offer into a tailored resume, cover letter, and application email, with documents generated from a GitHub issue.

### Features and fixes

- Added a one-page resume template and prompts for generating tailored application documents.
- Added GitHub issue forms and a workflow to generate, export, commit, and link documents.
- Added scripts for building prompts and exporting HTML documents to PDF, including a strict one-page check.
- Added CI checks, Dependabot configuration, and a Node.js 22 version pin.
- Fixed prompt generation from piped input by reading stdin as a stream.

### Contributors

- Teddy Gando
