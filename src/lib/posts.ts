import frontMatter from 'front-matter';

import type PostAttributes from './post-attributes';
import { contentSlug, postSummary, publishedLabel } from './post-path';

export interface PostSummary {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  minutes: number;
}

const files = import.meta.glob<string>('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export function loadPosts(): PostSummary[] {
  return Object.entries(files)
    .map(([path, raw]) => {
      const { attributes, body } = frontMatter<PostAttributes>(raw);
      const filename = /([^/]+)\.md$/.exec(path)?.[1] ?? '';

      return {
        slug: contentSlug(attributes.slug, filename),
        title: attributes.displayTitle,
        date: publishedLabel(attributes.published),
        tags: attributes.tags,
        summary: postSummary(body),
        minutes: Math.max(1, Math.round(body.split(/\s+/).length / 225)),
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}
