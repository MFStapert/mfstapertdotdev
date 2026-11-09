import frontMatter from 'front-matter';

export interface ResumeAttributes {
  period: string;
  employer: string;
  title: string;
  languages?: string;
  activities?: string[];
  technology?: string[];
}

export interface ResumeEntry {
  order: number;
  attributes: ResumeAttributes;
  body: string;
}

function escapeHtml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

/** Resume copy is plain paragraphs. Render it here so the page does not depend on Marked. */
export function renderResumeBody(markdown: string): string {
  return markdown
    .trim()
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph.replace(/\s+/g, ' ').trim())}</p>`)
    .filter((paragraph) => paragraph !== '<p></p>')
    .join('');
}

const files = import.meta.glob<string>('../content/resume/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export function loadResume(): ResumeEntry[] {
  return Object.entries(files)
    .map(([path, raw]) => {
      const parsed = frontMatter<ResumeAttributes>(raw);
      const match = /\/(\d+)/.exec(path);

      return {
        order: match ? Number(match[1]) : 0,
        attributes: parsed.attributes,
        body: renderResumeBody(parsed.body),
      };
    })
    .sort((a, b) => b.order - a.order);
}
