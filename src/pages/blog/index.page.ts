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
    <h1><span class="text-primary">#</span>Blog</h1>
    @for (post of posts; track post.slug) {
      <div class="mt-large w-full">
        <a
          class="inline-block border-l pl-medium hover:text-dark-grey"
          [routerLink]="['/blog', slug(post)]"
        >
          <h2 class="mb-small text-h1">{{ post.attributes.displayTitle }}</h2>
        </a>
        <p class="pl-medium text-h3 text-primary">
          Published: {{ label(post.attributes.published) }}
        </p>
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
