# Contributing to Appipeline

Thanks for your interest in Appipeline! Bug reports, ideas and pull requests are welcome.

## Reporting a bug or suggesting a feature

Open an issue with the **Bug report** or **Feature request** form. For a security issue, follow
[SECURITY.md](SECURITY.md) instead of opening a public issue.

Never include personal data in an issue: no real resume, name, phone number or email address.

## Setting up

```sh
git clone https://github.com/teddygandon/appipeline.git
cd appipeline
npm install
```

Node.js 20 or later is required (the CI uses the version in `.nvmrc`).

## Making a change

1. Fork the repository and create a branch from `main`.
2. Make your change, and add or update the tests in `test/` for any change to `scripts/`.
3. Check that everything passes:

   ```sh
   npm test
   npm run test:spelling
   npm run export-pdf -- --strict   # if you changed the resume template
   ```

   Add new legitimate words (product names, technical terms) to `cspell.json`.

4. Update the README and the prompt templates if the behavior changes, and add a line to the
   "Unreleased" section of [CHANGELOG.md](CHANGELOG.md).
5. Open a pull request describing what changes and why.

## Guidelines

- **Keep it dependency-light.** The scripts use Node.js built-ins; the resume is plain HTML and
  CSS with no build step. Discuss a new dependency in an issue first.
- **Keep the template valid.** The resume and the cover letter must fit on one A4 page, and the
  tailoring guide at the top of `resume/template.pdf.html` must match its markup.
- **Prompts are code.** A change to `prompts/` changes every generated document: explain the
  reason in the pull request, ideally with a before and after example.
- **Use fictional data only** in examples, tests and templates (`example.com` domains, 555-01xx
  phone numbers).
- Follow the existing style: ES modules, 2-space indentation, short comments that explain why.

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE),
and to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
