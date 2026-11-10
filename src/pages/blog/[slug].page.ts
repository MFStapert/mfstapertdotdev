import { injectContent, injectContentFiles, MarkdownComponent } from '@analogjs/content';
import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot } from '@angular/router';

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
  imports: [MarkdownComponent, PostTags],
  template: `
    @if (post(); as post) {
      <article class="inline-block">
        <h1>{{ post.attributes.displayTitle }}</h1>
        <post-tags class="mb-small" [tags]="post.attributes.tags" />
        <p class="mb-large text-h3 text-primary">
          Published: {{ label(post.attributes.published) }}
        </p>
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
}
