import { injectContentFiles } from '@analogjs/content';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

import PostAttributes from '../post-attributes';
import { contentSlug, publishedLabel } from '../post-path';

function slugFromUrl(url: string): string | null {
  const path = url.split('?')[0]?.split('#')[0]?.replace(/\/+$/, '') ?? '';
  const match = /^\/blog\/([^/]+)$/.exec(path);
  return match?.[1] ?? null;
}

@Component({
  selector: 'blog-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  template: `
    @if (post(); as post) {
      <article>
        <h1>{{ post.attributes.displayTitle }}</h1>
        <h3 class="color-primary">Published: {{ label(post.attributes.published) }}</h3>
        <router-outlet />
      </article>
    } @else {
      <router-outlet />
    }
  `,
})
export default class BlogLayout {
  private readonly router = inject(Router);
  private readonly posts = injectContentFiles<PostAttributes>((file) =>
    file.filename.includes('/content/blog/'),
  );
  private readonly slug = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => slugFromUrl(event.urlAfterRedirects)),
      startWith(slugFromUrl(this.router.url)),
    ),
    { initialValue: slugFromUrl(this.router.url) },
  );

  readonly post = computed(() => {
    const slug = this.slug();
    if (!slug) {
      return undefined;
    }

    return this.posts.find((item) => contentSlug(item.attributes.slug, item.slug) === slug);
  });

  label(value: unknown): string {
    return publishedLabel(value);
  }
}
