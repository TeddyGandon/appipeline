#!/usr/bin/env node
// Builds a ready-to-run prompt from a job offer issue: the template prompts/<name>.md with its
// placeholders replaced by the issue fields.
//
//   gh issue view 12 --json body --jq .body | node scripts/build-prompt.js resume > prompt.txt
//   ISSUE_BODY="$(cat issue.md)" node scripts/build-prompt.js cover-letter > prompt.txt
//
// The issue body is read from the ISSUE_BODY environment variable, or from standard input. It
// follows the "Job offer" issue form: "Company", "Job title" and "Job description" headings, each
// followed by its value. The optional PORTFOLIO_SITEMAP environment variable fills the
// [PORTFOLIO SITEMAP] placeholder; without it, the paragraphs that mention it are left out.
import { text } from 'node:stream/consumers';
import { PromptError, buildPrompt } from './lib/prompt.js';

const name = process.argv[2];
if (!name) {
  console.error('Usage: node scripts/build-prompt.js <resume|cover-letter|email>  (issue body on stdin or in ISSUE_BODY)');
  process.exit(1);
}

try {
  // Read stdin as a stream: readFileSync(0) fails with EAGAIN when the pipe is non-blocking, as
  // it is when fed by gh.
  const body = process.env.ISSUE_BODY ?? (process.stdin.isTTY ? '' : await text(process.stdin));
  process.stdout.write(`${buildPrompt(name, body, process.env.PORTFOLIO_SITEMAP?.trim())}\n`);
} catch (error) {
  if (!(error instanceof PromptError)) throw error;
  console.error(`build-prompt: ${error.message}`);
  process.exit(1);
}
