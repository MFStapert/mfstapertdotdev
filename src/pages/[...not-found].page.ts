import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';

import { mfstapertTitle } from '../lib/title';

export const routeMeta: RouteMeta = {
  title: mfstapertTitle('page not found'),
};

@Component({
  selector: 'not-found',
  template: `
    <h1 class="max-w-182 leading-15">
      <span class="text-primary"> &lt; </span>404<span class="text-primary">/&gt;</span>
    </h1>
  `,
})
export default class NotFoundPage {}
