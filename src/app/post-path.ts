/** Same slug the prerender transform uses: front matter, then the filename. */
export function contentSlug(attributeSlug: string | undefined, filenameSlug: string): string {
  return attributeSlug || filenameSlug;
}

/** YAML may parse an unquoted date as a Date. Always show YYYY-MM-DD. */
export function publishedLabel(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  const text = String(value ?? '');
  return /^\d{4}-\d{2}-\d{2}/.test(text) ? text.slice(0, 10) : text;
}
