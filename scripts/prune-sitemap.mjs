import { readFileSync, writeFileSync } from 'node:fs';

const path = 'dist/analog/public/sitemap.xml';
const xml = readFileSync(path, 'utf8');
const pruned = xml.replace(
  /\s*<url>\s*<loc>https:\/\/mfstapert\.dev\/404\.html<\/loc>[\s\S]*?<\/url>/,
  '',
);

if (pruned === xml || pruned.includes('/404.html')) {
  console.error('Expected sitemap.xml to contain a /404.html entry to remove.');
  process.exit(1);
}

writeFileSync(path, pruned);
