/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog from '@analogjs/platform';

import { contentSlug } from './src/app/post-path.ts';

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
        routes: async () => [
          '/',
          '/resume',
          '/blog',
          '/404.html',
          {
            contentDir: 'src/content/blog',
            transform: (file: { attributes: { slug?: string }; name: string }) =>
              `/blog/${contentSlug(file.attributes.slug, file.name)}`,
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
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    reporters: ['default'],
  },
}));
