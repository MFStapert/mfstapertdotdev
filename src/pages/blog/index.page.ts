import { injectContentFiles } from '@analogjs/content';
import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import PostAttributes from '../../lib/post-attributes';
import { contentSlug, publishedLabel } from '../../lib/post-path';
import { mfstapertTitle } from '../../lib/title';

export const routeMeta: RouteMeta = {
  title: mfstapertTitle('blog'),
};

@Component({
  selector: 'blog',
  imports: [RouterLink],
  template: `
    <h1><span class="color-primary">#</span>Blog</h1>
    @for (post of posts; track post.slug) {
      <div class="blog-item">
        <a [routerLink]="['/blog', slug(post)]">
          <h1>{{ post.attributes.displayTitle }}</h1>
        </a>
        <h3 class="color-primary">Published: {{ label(post.attributes.published) }}</h3>
      </div>
    }
  `,
})
export default class BlogPage {
  readonly posts = injectContentFiles<PostAttributes>((file) =>
    file.filename.includes('/content/blog/'),
  ).sort((a, b) =>
    publishedLabel(b.attributes.published).localeCompare(publishedLabel(a.attributes.published)),
  );

  slug(post: { attributes: PostAttributes; slug: string }): string {
    return contentSlug(post.attributes.slug, post.slug);
  }

  label(value: unknown): string {
    return publishedLabel(value);
  }
}
