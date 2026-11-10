import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { mfstapertTitle } from '../lib/title';

export const routeMeta: RouteMeta = {
  title: mfstapertTitle('page not found'),
};

@Component({
  selector: 'not-found',
  imports: [RouterLink],
  template: `
    <section class="grid w-full place-items-center py-16 text-center">
      <p class="mb-medium font-mono text-sm text-primary">// error: route not found</p>
      <h1
        class="glitch mb-large font-mono text-[clamp(4rem,14vw,9rem)] leading-none font-semibold tracking-tighter"
        data-text="</404>"
      >
        <span class="text-primary">&lt;/</span>404<span class="text-primary">&gt;</span>
      </h1>
      <p class="mb-large max-w-[45ch] text-lg">
        This page doesn’t exist, or it moved. Old blog links now live under
        <code class="font-mono text-ink-strong">/blog/&lt;slug&gt;</code>.
      </p>
      <div class="flex flex-wrap justify-center gap-small">
        <a
          class="rounded-full bg-primary px-6 py-3 font-semibold text-on-primary hover:text-on-primary"
          routerLink="/"
          >Go home</a
        >
        <a
          class="rounded-full border border-ink/30 px-6 py-3 font-semibold hover:border-primary"
          routerLink="/blog"
          >Browse the blog</a
        >
      </div>
    </section>
  `,
})
export default class NotFoundPage {}
