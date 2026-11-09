import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, skip } from 'rxjs';

@Component({
  selector: 'root',
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  preserveWhitespaces: true,
  template: `
    <!-- Not sr-only: Font Awesome's .sr-only sets clip, which focus:not-sr-only doesn't reset. -->
    <a
      class="absolute top-medium left-medium -translate-y-[200%] bg-white px-medium py-small focus:translate-y-0 print:hidden"
      href="#main"
      >Skip to content</a
    >

    <header>
      <div class="page-container">
        <p class="mb-small flex-[1_1_50%] py-large text-h1 print:pt-0">
          <a class="group hover:text-dark-grey hover:no-underline" routerLink="/"
            >{{ '{' }} <span class="text-primary group-hover:underline">mfstapert</span>;
            {{ '}' }}</a
          >
        </p>
        <nav class="flex flex-[1_1_50%] flex-row-reverse print:hidden" aria-label="Main">
          <ul class="mt-8.5">
            @for (link of navLinks; track link.path) {
              <li class="inline-block">
                <a
                  class="px-large text-lg/[30px]"
                  [routerLink]="link.path"
                  routerLinkActive="text-primary"
                  [routerLinkActiveOptions]="{ exact: true }"
                  >{{ link.label }}</a
                >
              </li>
            }
          </ul>
        </nav>
      </div>
    </header>

    <main
      id="main"
      class="border-y bg-light-grey p-large print:border-0 print:bg-white print:p-0"
      tabindex="-1"
    >
      <div class="page-container">
        <router-outlet />
      </div>
    </main>

    <footer class="p-large print:hidden">
      <div class="page-container">
        <h2 class="w-full">
          <span class="text-primary">Want to get in touch? </span>Find me here:
        </h2>
        <div class="py-medium text-[1.875rem]/none *:pr-large">
          <a href="https://github.com/MFStapert" aria-label="GitHub"
            ><i class="fa-brands fa-github" aria-hidden="true"></i
          ></a>
          <a href="https://www.linkedin.com/in/marijn-stapert-05091182/" aria-label="LinkedIn"
            ><i class="fa-brands fa-linkedin-in" aria-hidden="true"></i
          ></a>
          <a href="/rss.xml" aria-label="RSS feed"
            ><i class="fa-solid fa-rss" aria-hidden="true"></i
          ></a>
        </div>
      </div>
    </footer>
  `,
})
export class App {
  readonly navLinks = [
    { path: '/', label: 'Home' },
    { path: '/resume', label: 'Resume' },
    { path: '/blog', label: 'Blog' },
  ];

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
