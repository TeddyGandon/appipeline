import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { describe, it } from 'node:test';
import { FIELDS, PROMPTS_DIR, PromptError, buildPrompt, fillTemplate, parseIssue, readFields } from '../scripts/lib/prompt.js';

// An issue body as GitHub renders the "Job offer" issue form.
const ISSUE = `### Company

Acme

### Job title

Backend Engineer

### Job description

We build rockets.

## Requirements

- Node.js, $5k bonus`;

describe('parseIssue', () => {
  it('splits the body on its headings', () => {
    const sections = parseIssue('# One\nfirst\n\n## Two\r\nsecond\nline\n');
    assert.deepEqual(sections, { one: 'first', two: 'second\nline' });
  });

  it('ignores the text before the first heading', () => {
    assert.deepEqual(parseIssue('intro\n# Title\nvalue'), { title: 'value' });
  });

  it('only splits on the given headings', () => {
    assert.deepEqual(parseIssue('# One\na\n## Sub\nb', ['one']), { one: 'a\n## Sub\nb' });
  });
});

describe('readFields', () => {
  it('reads the values of the issue form fields', () => {
    const fields = readFields(ISSUE);
    assert.equal(fields['[COMPANY]'], 'Acme');
    assert.equal(fields['[JOB TITLE]'], 'Backend Engineer');
  });

  it('keeps the Markdown headings of the job description', () => {
    assert.equal(readFields(ISSUE)['[JOB DESCRIPTION]'], 'We build rockets.\n\n## Requirements\n\n- Node.js, $5k bonus');
  });

  it('reads the headings case-insensitively', () => {
    assert.equal(readFields(ISSUE.replace('### Company', '# COMPANY'))['[COMPANY]'], 'Acme');
  });

  for (const empty of ['', '_No response_', '[COMPANY]']) {
    it(`rejects an empty field (${JSON.stringify(empty)})`, () => {
      const body = ISSUE.replace('Acme', empty);
      assert.throws(() => readFields(body), PromptError);
    });
  }
});

describe('fillTemplate', () => {
  const values = { '[COMPANY]': 'A$&B', '[JOB TITLE]': 'Dev', '[JOB DESCRIPTION]': 'Text' };

  it('replaces every placeholder and keeps "$" patterns as-is', () => {
    assert.equal(fillTemplate('[COMPANY] / [JOB TITLE] / [COMPANY]', values), 'A$&B / Dev / A$&B');
  });

  it('fills the portfolio sitemap when given', () => {
    const prompt = fillTemplate('Intro\n\nSitemap: [PORTFOLIO SITEMAP]\n\nEnd', values, 'https://example.com/sitemap.xml');
    assert.equal(prompt, 'Intro\n\nSitemap: https://example.com/sitemap.xml\n\nEnd');
  });

  it('drops the portfolio paragraph without a sitemap', () => {
    assert.equal(fillTemplate('Intro\n\nSitemap: [PORTFOLIO SITEMAP]\n\nEnd', values), 'Intro\n\nEnd');
  });
});

describe('prompt templates', () => {
  const templates = readdirSync(PROMPTS_DIR).map((file) => file.replace(/\.md$/, ''));

  it('include the resume, cover letter and email prompts', () => {
    assert.deepEqual(templates.sort(), ['cover-letter', 'email', 'resume']);
  });

  for (const name of templates) {
    it(`${name}: uses every field and leaves no placeholder behind`, () => {
      const prompt = buildPrompt(name, ISSUE, 'https://example.com/sitemap.xml');
      for (const value of ['Acme', 'Backend Engineer', 'We build rockets.', 'Node.js, $5k bonus']) {
        assert.ok(prompt.includes(value), `missing "${value}"`);
      }
      assert.doesNotMatch(prompt, /\[[A-Z ]+\]/);
    });
  }

  it('rejects an unknown template', () => {
    assert.throws(() => buildPrompt('unknown', ISSUE), PromptError);
  });

  it('cover every issue field', () => {
    assert.deepEqual(Object.keys(FIELDS), ['[COMPANY]', '[JOB TITLE]', '[JOB DESCRIPTION]']);
  });
});
