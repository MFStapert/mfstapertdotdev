import { Component } from '@angular/core';
import { RouteMeta } from '@analogjs/router';

import { mfstapertTitle } from '../title';

export const routeMeta: RouteMeta = {
  title: mfstapertTitle(),
};

@Component({
  selector: 'app-not-found',
  template: `
    <h1 class="hero-title">
      <span class="color-primary"> &lt; </span>404<span class="color-primary">/&gt;</span>
    </h1>
  `,
})
export default class NotFoundPage {}
