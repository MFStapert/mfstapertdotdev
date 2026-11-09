// Prints the prerendered /resume page to resume.pdf in the build output.
import puppeteer from 'puppeteer';
import { preview } from 'vite';

const outDir = 'dist/analog/public';

const server = await preview({ configFile: false, logLevel: 'warn', build: { outDir } });
const browser = await puppeteer.launch({ channel: 'chrome', args: ['--no-sandbox'] });

try {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  // Keep build runs out of the analytics.
  page.on('request', (request) =>
    request.url().startsWith('https://gc.zgo.at/') ? request.abort() : request.continue(),
  );

  await page.goto(new URL('/resume/', server.resolvedUrls.local[0]).href, {
    waitUntil: 'networkidle0',
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
