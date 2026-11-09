import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, skip } from 'rxjs';

@Component({
  selector: 'root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterOutlet],
  // Keep the spaces between inline nav items and footer icons, matching the Jekyll HTML.
  preserveWhitespaces: true,
  template: `
    <header>
      <div class="container">
        <h1 class="site-title">
          <a routerLink="/">{{ '{' }} <span class="color-primary">mfstapert</span>; {{ '}' }}</a>
        </h1>
        <nav class="main-nav">
          <ul>
            <li><a routerLink="/">Home</a></li>
            <li><a routerLink="/resume">Resume</a></li>
            <li><a routerLink="/blog">Blog</a></li>
          </ul>
        </nav>
      </div>
    </header>

    <main>
      <div class="container">
        <router-outlet />
      </div>
    </main>

    <footer>
      <div class="container">
        <h2><span class="color-primary">Want to get in touch? </span>Find me here:</h2>
        <div class="social-icons">
          <a href="https://github.com/MFStapert"><i class="fa fa-github"></i></a>
          <a href="https://www.linkedin.com/in/marijn-stapert-05091182/"
            ><i class="fa fa-linkedin"></i
          ></a>
          <a href="https://twitter.com/MarijnStapert"><i class="fa fa-twitter"></i></a>
        </div>
      </div>
    </footer>
  `,
})
export class App {
  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) {
      return;
    }

    // count.js records the first load. Later router navigations need an explicit count.
    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        skip(1),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        window.goatcounter?.count({ path: location.pathname });
      });
  }
}
