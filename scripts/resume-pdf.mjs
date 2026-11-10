// Prints the prerendered /resume page to resume.pdf in the build output.
import { chromium } from 'playwright';
import { preview } from 'vite';

const outDir = 'dist/analog/public';

const server = await preview({ configFile: false, logLevel: 'warn', build: { outDir } });
const browser = await chromium.launch({ channel: 'chrome' });

try {
  const page = await browser.newPage();
  // Keep build runs out of the analytics.
  await page.route('https://gc.zgo.at/**', (route) => route.abort());

  await page.goto(new URL('/resume/', server.resolvedUrls.local[0]).href, {
    waitUntil: 'networkidle',
  });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: `${outDir}/resume.pdf`,
    preferCSSPageSize: true,
    printBackground: true,
    scale: 0.75,
  });
  console.log(`Wrote ${outDir}/resume.pdf`);
} finally {
  await browser.close();
  await server.close();
}
