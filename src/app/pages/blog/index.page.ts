import { Component } from '@angular/core';
import { RouteMeta } from '@analogjs/router';

import { mfstapertTitle } from '../../title';

export const routeMeta: RouteMeta = {
  title: mfstapertTitle('blog'),
};

@Component({
  selector: 'app-blog',
  template: `
    <h1><span class="color-primary">#</span>Blog</h1>
  `,
})
export default class BlogPage {}
