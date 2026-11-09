/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { defineConfig, type Plugin } from 'vite';

import type PostAttributes from './src/lib/post-attributes.ts';
import { contentSlug, sitemapLastmod } from './src/lib/post-path.ts';

// Analog registers every src/content markdown file as a route. Resume entries
// are content for /resume, and posts are rendered by pages/blog/[slug]. Keep
// the files available to injectContent, but do not route them.
function contentIsNotARoute(): Plugin {
  const spread = '...ANALOG_CONTENT_ROUTE_FILES';
  const filtered =
    "...Object.fromEntries(Object.entries(ANALOG_CONTENT_ROUTE_FILES).filter(([key]) => !key.includes('/content/')))";

  return {
    name: 'content-is-not-a-route',
    transform(code) {
      if (!code.includes(spread) || !code.includes('function createRoutes')) {
        return;
      }

      return code.replaceAll(spread, filtered);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(() => ({
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['import'],
      },
    },
  },
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
  },
  plugins: [
    analog({
      static: true,
      ssr: true,
      additionalPagesDirs: ['/src'],
      content: {
        highlighter: 'shiki',
        shikiOptions: {
          highlight: {
            theme: 'github-light',
          },
          highlighter: {
            additionalLangs: ['typescript', 'plaintext'],
          },
        },
      },
      prerender: {
        sitemap: {
          host: 'https://mfstapert.dev',
        },
        routes: () => [
          '/',
          '/resume',
          '/blog',
          '/404.html',
          {
            contentDir: 'src/content/blog',
            transform: (file: { attributes: PostAttributes; name: string }) =>
              `/blog/${contentSlug(file.attributes.slug, file.name)}`,
            sitemap: (file: { attributes: PostAttributes }) => ({
              lastmod: sitemapLastmod(file.attributes.published),
            }),
          },
        ],
      },
      // GitHub Pages serves this file for unknown URLs. Skip SSR so the
      // client router can hydrate it as the requested route instead of the
      // prerendered 404 markup.
      nitro: {
        routeRules: {
          '/404.html': { ssr: false },
        },
      },
    }),
    contentIsNotARoute(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    reporters: ['default'],
  },
}));
