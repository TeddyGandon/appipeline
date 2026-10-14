#!/usr/bin/env node
// Exports a printable *.pdf.html page (a resume or a cover letter) to PDF with Puppeteer's bundled
// headless Chrome. The PDF is written next to its source.
//
//   npm run export-pdf                                    resume/template.pdf.html -> resume/template.pdf
//   npm run export-pdf -- acme-backend                    resume/acme-backend.pdf.html (a resume name)
//   npm run export-pdf -- cover-letter/acme.pdf.html      any path to a *.pdf.html page
//   npm run export-pdf -- --strict cover-letter/acme.pdf.html
//
// Every document is designed for exactly one A4 page: the script warns when the content spills
// over, and fails instead with --strict.
import { existsSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const resumeDir = join(rootDir, 'resume');
const SUFFIX = '.pdf.html';

function fail(message) {
  console.error(`export-pdf: ${message}`);
  process.exit(1);
}

// Returns the page to export: a path to a *.pdf.html file, or the name of a resume in resume/.
function resolveInput(arg = 'template') {
  if (arg.endsWith(SUFFIX) && existsSync(resolve(arg))) return resolve(arg);
  const name = arg.replace(/\.pdf\.html$/, '').replace(/\.html$/, '');
  const file = join(resumeDir, `${name}${SUFFIX}`);
  if (!existsSync(file)) {
    const available = readdirSync(resumeDir)
      .filter((entry) => entry.endsWith(SUFFIX))
      .map((entry) => entry.slice(0, -SUFFIX.length));
    fail(`no "${arg}" page found. Pass a path to a *${SUFFIX} file, or a resume name: ${available.join(', ')}`);
  }
  return file;
}

const args = process.argv.slice(2);
const strict = args.includes('--strict');
const input = resolveInput(args.find((arg) => !arg.startsWith('--')));
const output = `${input.slice(0, -SUFFIX.length)}.pdf`;

const browser = await puppeteer.launch();
try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(input).href, { waitUntil: 'networkidle0' });
  // The self-hosted fonts must be loaded, or the PDF falls back to a system font.
  await page.evaluate(() => document.fonts.ready);
  // Page size and margins come from the page's own @page rule (A4, no margin).
  const pdf = await page.pdf({ path: output, preferCSSPageSize: true, printBackground: true });

  const pages = Math.max(
    0,
    ...[...Buffer.from(pdf).toString('latin1').matchAll(/\/Count (\d+)/g)].map((match) => Number(match[1])),
  );
  const [from, to] = [input, output].map((path) => relative(rootDir, path).replaceAll('\\', '/'));
  console.log(`export-pdf: ${from} -> ${to} (${pages} page${pages === 1 ? '' : 's'})`);
  if (pages > 1) {
    const message = `the document no longer fits on one page (${pages} pages); trim some content.`;
    if (strict) {
      console.error(`export-pdf: error, ${message}`);
      process.exitCode = 1;
    } else {
      console.warn(`export-pdf: warning, ${message}`);
    }
  }
} finally {
  await browser.close();
}
