import { readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';

import frontMatter from 'front-matter';
import { defineEventHandler, setResponseHeader } from 'h3';

import type PostAttributes from '../../lib/post-attributes';
import { buildRss } from '../../lib/rss';

const blogDir = join(process.cwd(), 'src/content/blog');

export default defineEventHandler((event) => {
  const posts = readdirSync(blogDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const parsed = frontMatter<PostAttributes>(readFileSync(join(blogDir, file), 'utf8'));
      return { attributes: parsed.attributes, filename: basename(file, '.md'), body: parsed.body };
    });

  setResponseHeader(event, 'content-type', 'application/rss+xml; charset=utf-8');
  return buildRss(posts);
});
