import frontMatter from 'front-matter';

import type PostAttributes from './post-attributes';

const files = import.meta.glob<string>('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const posts = Object.entries(files).map(([path, raw]) => ({
  path,
  attributes: frontMatter<PostAttributes>(raw).attributes,
}));

describe('blog posts', () => {
  it('exist', () => {
    expect(posts.length).toBeGreaterThan(0);
  });

  it.each(posts)('$path has lowercase tags and no [topic] in its titles', ({ attributes }) => {
    expect(attributes.tags.length).toBeGreaterThan(0);
    for (const tag of attributes.tags) {
      expect(tag).toBe(tag.toLowerCase());
    }
    expect(attributes.title).not.toMatch(/\[.*\]/);
    expect(attributes.displayTitle).not.toMatch(/\[.*\]/);
  });
});
