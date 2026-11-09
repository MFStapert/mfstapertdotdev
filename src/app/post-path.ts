/** Same slug the prerender transform uses: front matter, then the filename. */
export function contentSlug(attributeSlug: string | undefined, filenameSlug: string): string {
  return attributeSlug || filenameSlug;
}

/** YAML may parse an unquoted date as a Date. Always show YYYY-MM-DD. */
export function publishedLabel(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
    return '';
  }

  const text = String(value);
  return /^\d{4}-\d{2}-\d{2}/.test(text) ? text.slice(0, 10) : text;
}

/** Sitemap lastmod must be a real calendar date. */
export function sitemapLastmod(value: unknown): string {
  const label = publishedLabel(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(label)) {
    throw new Error(`Blog post published date must be YYYY-MM-DD (got ${JSON.stringify(value)})`);
  }

  return label;
}
