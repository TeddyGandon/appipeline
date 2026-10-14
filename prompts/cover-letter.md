Write a cover letter for the job offer "[JOB TITLE]" from the company "[COMPANY]", described below.

Base it on my experience and skills from "resume/template.pdf.html" (or the resume tailored to this job offer, if one exists). Highlight the experiences that match the job description best, and explain why I am interested in this company and this role.

Where relevant, link to resources from my portfolio that support the letter (projects, articles, case studies). The portfolio pages are listed in its sitemap: [PORTFOLIO SITEMAP]

Reuse the key words of the job description so the letter passes applicant tracking systems (ATS).

Length: the body of the letter (without the header, the date, the greeting and the signature) must be between 250 and 350 words, in 3 or 4 paragraphs, so that the letter fits on one page.

Write it the way I would write it myself, so that it reads as written by a human and is not flagged by AI detectors:
- Use the first person and a professional but personal tone, like an experienced professional writing to a future colleague, not a sales pitch.
- Be specific: use concrete facts from my resume (projects, technologies, team sizes, figures) and one precise detail about the company or the role that shows I read the job offer. Never invent an experience, a figure or a fact about the company.
- Vary the length and the structure of the sentences; mix short sentences with longer ones. Do not start several sentences or paragraphs the same way.
- No bullet lists, no headings in the body, no em dashes, no lists of three adjectives, no rhetorical questions, and no closing paragraph that summarizes the letter.
- Avoid the words and phrases typical of AI-written text: "I am writing to express my interest", "I am thrilled / excited to apply", "passionate", "delve", "leverage", "spearheaded", "seamless", "robust", "cutting-edge", "dynamic", "fast-paced environment", "tapestry", "testament", "navigate", "foster", "in today's world", "proven track record", "I believe I would be a great fit".
- Once written, reread the letter and rewrite every sentence that sounds generic or could be sent to any company.

Write it as a printable A4 HTML page in "cover-letter/", under a short, lowercase, hyphenated name made of the company and the job title, ending with ".pdf.html" (for example "acme-backend-engineer.pdf.html"). Reuse the look of "resume/template.pdf.html" (the EB Garamond fonts from "../resume/fonts/", an A4 `@page` rule with no margin) so that it matches the resume. Check that it fits on one page with `npm run export-pdf -- --strict cover-letter/<name>.pdf.html`, and shorten the letter if the export reports more than one page.

Here is the job description:

---

[JOB DESCRIPTION]

---
