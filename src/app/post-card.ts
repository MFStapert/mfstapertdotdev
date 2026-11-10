import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { PostSummary } from '../lib/posts';
import { PostTags } from './post-tags';

@Component({
  selector: 'post-card',
  imports: [PostTags, RouterLink],
  host: { class: 'block' },
  template: `
    <article
      class="group relative overflow-hidden rounded-2xl border bg-surface p-large transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_12px_32px_-12px_rgb(0_124_166/0.35)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <span
        class="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-primary transition-transform duration-300 group-hover:scale-y-100"
        aria-hidden="true"
      ></span>
      <p class="meta mb-small">
        <time [attr.datetime]="post().date">{{ post().date }}</time> · {{ post().minutes }} min read
      </p>
      <h3 class="mb-small text-h2">
        <a
          class="after:absolute after:inset-0 group-hover:text-primary"
          [routerLink]="['/blog', post().slug]"
          >{{ post().title }}</a
        >
      </h3>
      <p class="mb-medium line-clamp-3">{{ post().summary }}</p>
      <post-tags [tags]="post().tags" />
    </article>
  `,
})
export class PostCard {
  readonly post = input.required<PostSummary>();
}
