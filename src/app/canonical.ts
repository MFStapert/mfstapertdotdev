export const SITE_ORIGIN = 'https://mfstapert.dev';

/** Absolute canonical URL. Trailing slashes are removed except for the site root. */
export function canonicalHref(url: string): string {
  const path = url.split('?')[0]?.split('#')[0] ?? '/';
  if (path === '' || path === '/') {
    return `${SITE_ORIGIN}/`;
  }

  return `${SITE_ORIGIN}${path.replace(/\/+$/, '')}`;
}
