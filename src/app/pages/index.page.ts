import { Component } from '@angular/core';
import { RouteMeta } from '@analogjs/router';

import { mfstapertTitle } from '../title';

export const routeMeta: RouteMeta = {
  title: mfstapertTitle(),
};

@Component({
  selector: 'app-home',
  template: `
    <h1 class="hero-title">
      Hi, I'm Marijn Stapert, a <span class="color-primary">software engineer</span> living in the
      Netherlands and currently working at XIP
    </h1>
  `,
})
export default class HomePage {}
