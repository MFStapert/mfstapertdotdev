import { buildRss, feedSummary, type FeedPost } from './rss';

const post = (published: string, displayTitle: string, body: string, slug?: string): FeedPost => ({
  attributes: { title: '', slug: slug ?? '', published, displayTitle, tags: [] },
  filename: displayTitle.toLowerCase().replace(/\W+/g, '-'),
  body,
});

describe('feedSummary', () => {
  it('returns the first paragraph as plain text', () => {
    expect(feedSummary('# Heading\n\nSee [the `docs`](https://x.dev)\nfor more.\n\nSecond.')).toBe(
      'See the docs for more.',
    );
  });
});

describe('buildRss', () => {
  const xml = buildRss([
    post('2021-12-29', 'Older', 'Old post.', 'older'),
    post(
      '2024-08-20',
      'Newer & better',
      'New post with `code`.\n\n```ts\nconst a = 1;\n```',
      'newer',
    ),
  ]);

  it('lists posts newest first with canonical links', () => {
    expect(xml.indexOf('<title>Newer &amp; better</title>')).toBeLessThan(
      xml.indexOf('<title>Older</title>'),
    );
    expect(xml).toContain('<link>https://mfstapert.dev/blog/newer</link>');
    expect(xml).toContain('<guid isPermaLink="true">https://mfstapert.dev/blog/older</guid>');
    expect(xml).toContain('<pubDate>Tue, 20 Aug 2024 00:00:00 GMT</pubDate>');
    expect(xml).toContain('<lastBuildDate>Tue, 20 Aug 2024 00:00:00 GMT</lastBuildDate>');
  });

  it('includes the full post as HTML in content:encoded', () => {
    expect(xml).toContain(
      '<content:encoded><![CDATA[<p>New post with <code>code</code>.</p>\n<pre><code class="language-ts">const a = 1;\n</code></pre>\n]]></content:encoded>',
    );
    expect(xml).toContain('<description>New post with code.</description>');
  });
});
