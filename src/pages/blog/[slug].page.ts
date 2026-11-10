import { injectContent, injectContentFiles, MarkdownComponent } from '@analogjs/content';
import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, RouterLink } from '@angular/router';

import { PostTags } from '../../app/post-tags';
import PostAttributes from '../../lib/post-attributes';
import { contentSlug, publishedLabel } from '../../lib/post-path';
import { mfstapertTitle } from '../../lib/title';

export const routeMeta: RouteMeta = {
  title: (route: ActivatedRouteSnapshot) => {
    const slug = route.paramMap.get('slug') ?? '';
    const post = injectContentFiles<PostAttributes>((file) =>
      file.filename.includes('/content/blog/'),
    ).find((item) => contentSlug(item.attributes.slug, item.slug) === slug);

    return typeof post?.attributes.title === 'string'
      ? post.attributes.title
      : mfstapertTitle('blog');
  },
};

@Component({
  selector: 'blog-post',
  imports: [MarkdownComponent, PostTags, RouterLink],
  template: `
    @if (post(); as post) {
      <div
        class="reading-progress fixed inset-x-0 top-0 z-50 h-1 bg-linear-to-r from-primary to-[#3f5bd8] print:hidden"
        aria-hidden="true"
      ></div>
      <article class="mx-auto w-full max-w-[70ch]">
        <a class="font-mono text-sm text-muted hover:text-primary" routerLink="/blog"
          >← all posts</a
        >
        <h1
          class="mt-medium mb-large text-[clamp(2rem,5vw,3rem)] leading-tight font-black tracking-tight"
        >
          {{ post.attributes.displayTitle }}
        </h1>
        <div class="mb-12 flex flex-wrap items-center gap-medium border-b pb-large">
          <p class="meta">
            <time [attr.datetime]="label(post.attributes.published)">{{
              label(post.attributes.published)
            }}</time>
            · {{ minutes(post.content) }} min read
          </p>
          <post-tags [tags]="post.attributes.tags" />
        </div>
        <analog-markdown class="prose prose-site" [content]="post.content" />
      </article>
    }
  `,
})
export default class BlogPostPage {
  readonly post = toSignal(
    injectContent<PostAttributes>({
      param: 'slug',
      subdirectory: 'blog',
    }),
  );

  label(value: unknown): string {
    return publishedLabel(value);
  }

  minutes(content: unknown): number {
    return typeof content === 'string'
      ? Math.max(1, Math.round(content.split(/\s+/).length / 225))
      : 1;
  }
}
