/** Same shape as the Jekyll title: `mfstapert.` plus an optional lowercased page name. */
export function mfstapertTitle(page?: string): string {
  if (!page) {
    return 'mfstapert.';
  }

  return `mfstapert.${page.toLowerCase()}`;
}
