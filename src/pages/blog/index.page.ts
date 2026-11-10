import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';

import { PostCard } from '../../app/post-card';
import { loadPosts } from '../../lib/posts';
import { mfstapertTitle } from '../../lib/title';

export const routeMeta: RouteMeta = {
  title: mfstapertTitle('blog'),
};

@Component({
  selector: 'blog',
  imports: [PostCard],
  template: `
    <header class="mb-12 w-full">
      <h1 class="mb-small"><span class="font-mono text-primary">#</span>Blog</h1>
      <p class="max-w-[60ch] text-lg text-muted">
        Notes on Angular, Node and the tooling around them. Also available as an
        <a
          class="font-semibold text-primary underline-offset-4 hover:underline"
          href="feed:https://mfstapert.dev/rss.xml"
          >RSS feed</a
        >.
      </p>
    </header>
    <h2 class="sr-only">All posts</h2>
    <div class="grid w-full gap-medium md:grid-cols-2">
      @for (post of posts; track post.slug) {
        <post-card [post]="post" />
      }
    </div>
  `,
})
export default class BlogPage {
  readonly posts = loadPosts();
}
