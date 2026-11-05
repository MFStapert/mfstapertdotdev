import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { canonicalHref } from './canonical';

@Component({
  selector: 'app-root',
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
          <a href="https://www.linkedin.com/in/marijn-stapert-05091182/"><i class="fa fa-linkedin"></i></a>
          <a href="https://twitter.com/MarijnStapert"><i class="fa fa-twitter"></i></a>
        </div>
      </div>
    </footer>
  `,
})
export class App {
  constructor() {
    const router = inject(Router);
    const doc = inject(DOCUMENT);
    const platformId = inject(PLATFORM_ID);

    const applyCanonical = (url: string) => {
      let link = doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = doc.createElement('link');
        link.setAttribute('rel', 'canonical');
        doc.head.appendChild(link);
      }
      link.setAttribute('href', canonicalHref(url));
    };

    applyCanonical(router.url);
    router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      applyCanonical(event.urlAfterRedirects);
      if (!isPlatformBrowser(platformId)) {
        return;
      }
      const goatcounter = (
        window as Window & { goatcounter?: { count: (options: { path: string }) => void } }
      ).goatcounter;
      // The script counts the first load. Count later client navigations only.
      if (event.id > 1) {
        goatcounter?.count({ path: event.urlAfterRedirects });
      }
    });
  }
}
