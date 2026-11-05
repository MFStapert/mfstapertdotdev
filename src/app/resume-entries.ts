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

const files = import.meta.glob<string>('../data/resume/*.md', {
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
        body: parsed.body.trim(),
      };
    })
    .sort((a, b) => b.order - a.order);
}
