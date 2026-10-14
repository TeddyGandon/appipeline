// Turns a job offer issue into a ready-to-run prompt: parses the issue fields and fills the
// placeholders of a prompt template from prompts/.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const PROMPTS_DIR = join(dirname(fileURLToPath(import.meta.url)), '../../prompts');

// Issue headings (lower case) holding each placeholder value. The headings come from the issue
// form in .github/ISSUE_TEMPLATE/job-offer.yml.
export const FIELDS = {
  '[COMPANY]': 'company',
  '[JOB TITLE]': 'job title',
  '[JOB DESCRIPTION]': 'job description',
};

// Optional placeholder: the lines holding it are dropped when no value is given.
export const PORTFOLIO_PLACEHOLDER = '[PORTFOLIO SITEMAP]';

// What GitHub writes for an empty issue form field, or a placeholder left as-is.
const EMPTY_VALUE = /^(_No response_|\[[A-Z ]+\])$/;

export class PromptError extends Error {}

// Splits a Markdown issue body into { heading (lower case): value } on its headings. Given a list
// of headings, only those split the body, so a value may hold headings of its own (a job
// description pasted with its "## Requirements" section, for example).
export function parseIssue(body, headings = null) {
  const sections = {};
  let current = null;
  for (const line of body.replace(/\r\n/g, '\n').split('\n')) {
    const heading = line.match(/^#{1,6}\s+(.+?)\s*$/);
    if (heading && (!headings || headings.includes(heading[1].toLowerCase()))) {
      current = heading[1].toLowerCase();
      sections[current] = [];
    } else if (current) {
      sections[current].push(line);
    }
  }
  return Object.fromEntries(Object.entries(sections).map(([key, lines]) => [key, lines.join('\n').trim()]));
}

// Returns the placeholder values of a job offer issue, or throws when a field is missing.
export function readFields(body) {
  const sections = parseIssue(body, Object.values(FIELDS));
  return Object.fromEntries(
    Object.entries(FIELDS).map(([placeholder, heading]) => {
      const value = sections[heading];
      if (!value || EMPTY_VALUE.test(value)) throw new PromptError(`the issue has no value under the "${heading}" heading`);
      return [placeholder, value];
    }),
  );
}

export function readTemplate(name) {
  try {
    return readFileSync(join(PROMPTS_DIR, `${name}.md`), 'utf8').replace(/\r\n/g, '\n').trim();
  } catch (error) {
    if (error.code === 'ENOENT') throw new PromptError(`no prompt named "${name}" in prompts/`);
    throw error;
  }
}

// Fills the template placeholders. Function replacements keep any "$" of the values as-is.
export function fillTemplate(template, values, portfolioSitemap = '') {
  let prompt = template;
  if (portfolioSitemap) {
    prompt = prompt.replaceAll(PORTFOLIO_PLACEHOLDER, () => portfolioSitemap);
  } else {
    prompt = prompt
      .split('\n\n')
      .filter((paragraph) => !paragraph.includes(PORTFOLIO_PLACEHOLDER))
      .join('\n\n');
  }
  for (const [placeholder, value] of Object.entries(values)) prompt = prompt.replaceAll(placeholder, () => value);
  return prompt;
}

export function buildPrompt(name, issueBody, portfolioSitemap = '') {
  return fillTemplate(readTemplate(name), readFields(issueBody), portfolioSitemap);
}
