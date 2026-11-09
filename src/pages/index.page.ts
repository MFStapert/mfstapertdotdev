import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';

import { mfstapertTitle } from '../lib/title';

export const routeMeta: RouteMeta = {
  title: mfstapertTitle(),
};

@Component({
  selector: 'home',
  template: `
    <h1 class="max-w-182 leading-15">
      Hi, I’m Marijn Stapert, a <span class="text-primary">software engineer</span> living in the
      Netherlands and currently working at XIP
    </h1>
  `,
})
export default class HomePage {}
