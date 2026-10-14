Create a resume tailored to the job offer "[JOB TITLE]" from the company "[COMPANY]", described below.

Start from a copy of "resume/template.pdf.html" saved in "resume/" under a short, lowercase, hyphenated name made of the company and the job title, ending with ".pdf.html" (for example "acme-backend-engineer.pdf.html").

Follow the tailoring guide in the HTML comment at the top of the template: only change the blocks marked `data-tailorable="true"`, plus the headline under the name, which may echo the job title of the offer.

Adapt the content so the resume gets through the pre-selection:
- Reword the profile to echo the priorities and the vocabulary of the job description.
- Reorder, trim and rephrase the experience highlights to surface the most relevant achievements first.
- Reorder the skills by relevance, and drop the side projects that are not relevant to the offer.
- Reuse the key words of the job description, so the resume passes applicant tracking systems (ATS) and AI screening tools.
- Never invent an experience, a skill, a figure or an employer.

The resume must fit on one A4 page. Check it with `npm run export-pdf -- --strict resume/<name>.pdf.html`, and trim the content if the export reports more than one page.

Here is the job description:

---

[JOB DESCRIPTION]

---
