import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { mfstapertTitle } from '../title';

export const routeMeta: RouteMeta = {
  title: mfstapertTitle(),
};

@Component({
  selector: 'not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 class="hero-title">
      <span class="color-primary"> &lt; </span>404<span class="color-primary">/&gt;</span>
    </h1>
  `,
})
export default class NotFoundPage {}
