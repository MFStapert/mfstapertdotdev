import { Marked } from 'marked';

import type PostAttributes from './post-attributes';
import { contentSlug, sitemapLastmod } from './post-path';

export const SITE_URL = 'https://mfstapert.dev';

// Analog registers an async highlighter on the global `marked`.
const markdown = new Marked();

export interface FeedPost {
  attributes: PostAttributes;
  /** Filename without extension. */
  filename: string;
  /** Markdown body without front matter. */
  body: string;
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function cdata(value: string): string {
  return `<![CDATA[${value.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`;
}

/** First paragraph of the post as plain text. */
export function feedSummary(markdown: string): string {
  const paragraph = markdown
    .trim()
    .split(/\n{2,}/)
    .find((block) => !/^(#|```|\s*[-*] )/.test(block));

  return (paragraph ?? '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replaceAll('`', '')
    .replace(/\s+/g, ' ')
    .trim();
}

function rfc822(date: string): string {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

export function buildRss(posts: FeedPost[]): string {
  const sorted = posts
    .map((post) => ({ ...post, date: sitemapLastmod(post.attributes.published) }))
    .sort((a, b) => b.date.localeCompare(a.date));

  const items = sorted.map((post) => {
    const link = `${SITE_URL}/blog/${contentSlug(post.attributes.slug, post.filename)}`;

    return `    <item>
      <title>${escapeXml(post.attributes.displayTitle)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${rfc822(post.date)}</pubDate>
      <description>${escapeXml(feedSummary(post.body))}</description>
      <content:encoded>${cdata(markdown.parse(post.body, { async: false }))}</content:encoded>
    </item>`;
  });
  const lastBuildDate = sorted[0]
    ? `\n    <lastBuildDate>${rfc822(sorted[0].date)}</lastBuildDate>`
    : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>mfstapert.</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Blog posts by Marijn Stapert</description>
    <language>en</language>${lastBuildDate}
${items.join('\n')}
  </channel>
</rss>
`;
}
