import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectContentFiles } from '@analogjs/content';
import { RouteMeta } from '@analogjs/router';

import PostAttributes from '../../post-attributes';
import { mfstapertTitle } from '../../title';

export const routeMeta: RouteMeta = {
  title: mfstapertTitle('blog'),
};

@Component({
  selector: 'app-blog',
  imports: [RouterLink],
  template: `
    <h1><span class="color-primary">#</span>Blog</h1>
    @for (post of posts; track post.slug) {
      <div class="blog-item">
        <a [routerLink]="['/blog', post.attributes.slug]">
          <h1>{{ post.attributes.displayTitle }}</h1>
        </a>
        <h3 class="color-primary">Published: {{ post.attributes.published }}</h3>
      </div>
    }
  `,
})
export default class BlogPage {
  readonly posts = injectContentFiles<PostAttributes>((file) => file.filename.includes('/content/blog/')).sort(
    (a, b) => b.attributes.published.localeCompare(a.attributes.published),
  );
}
