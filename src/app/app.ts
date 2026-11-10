import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, skip } from 'rxjs';

import { ThemeToggle } from './theme-toggle';

@Component({
  selector: 'root',
  imports: [RouterLink, RouterOutlet, RouterLinkActive, ThemeToggle],
  template: `
    <!-- Not sr-only: Font Awesome's .sr-only sets clip, which focus:not-sr-only doesn't reset. -->
    <a
      class="fixed top-medium left-medium z-50 -translate-y-[300%] rounded-lg bg-surface px-medium py-small shadow-lg focus:translate-y-0 print:hidden"
      href="#main"
      >Skip to content</a
    >

    <header class="sticky top-0 z-40 border-b bg-page/80 backdrop-blur-md print:hidden">
      <div class="page-container flex h-16 items-center justify-between gap-medium">
        <a
          class="group text-2xl font-semibold whitespace-nowrap text-ink-strong hover:text-ink-strong"
          routerLink="/"
          aria-label="mfstapert, home"
        >
          <span
            class="inline-block text-muted transition-transform duration-300 group-hover:-translate-x-1"
            >{{ '{' }}</span
          >&ngsp;<span class="text-primary">mfstapert</span>;&ngsp;<span
            class="inline-block text-muted transition-transform duration-300 group-hover:translate-x-1"
            >{{ '}' }}</span
          >
        </a>
        <div class="flex items-center gap-small sm:gap-medium">
          <nav aria-label="Main">
            <ul class="flex list-none gap-small font-mono text-sm sm:gap-medium">
              @for (link of navLinks; track link.path) {
                <li>
                  <a
                    class="relative px-1 py-2 after:absolute after:inset-x-1 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-primary after:transition-transform hover:after:scale-x-100"
                    [routerLink]="link.path"
                    routerLinkActive="text-primary after:scale-x-100"
                    [routerLinkActiveOptions]="{ exact: true }"
                    >{{ link.label }}</a
                  >
                </li>
              }
            </ul>
          </nav>
          <theme-toggle />
        </div>
      </div>
    </header>

    <main id="main" class="page-container py-large md:py-16 print:p-0" tabindex="-1">
      <router-outlet />
    </main>

    <footer class="mt-16 border-t print:hidden">
      <div class="page-container flex flex-wrap items-center justify-between gap-large py-large">
        <div>
          <h2 class="text-h2">Want to get in touch?</h2>
          <p class="text-muted">Find me here, or follow along with RSS.</p>
        </div>
        <ul class="flex list-none gap-small text-lg">
          @for (social of socials; track social.label) {
            <li>
              <a
                class="grid size-12 place-items-center rounded-full border bg-surface transition hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-on-primary motion-reduce:hover:translate-y-0"
                [href]="social.href"
                [attr.aria-label]="social.label"
                ><i [class]="social.icon" aria-hidden="true"></i
              ></a>
            </li>
          }
          <li>
            <a
              class="grid size-12 place-items-center rounded-full border bg-surface transition hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-on-primary motion-reduce:hover:translate-y-0"
              href="feed:https://mfstapert.dev/rss.xml"
              type="application/rss+xml"
              aria-label="RSS feed"
              ><i class="fa-solid fa-rss" aria-hidden="true"></i
            ></a>
          </li>
        </ul>
        <p class="meta w-full">© {{ year }} Marijn Stapert · built with Analog & Tailwind</p>
      </div>
    </footer>
  `,
})
export class App {
  readonly year = new Date().getFullYear();

  readonly navLinks = [
    { path: '/', label: 'home' },
    { path: '/resume', label: 'resume' },
    { path: '/blog', label: 'blog' },
  ];

  readonly socials = [
    { href: 'https://github.com/MFStapert', label: 'GitHub', icon: 'fa-brands fa-github' },
    {
      href: 'https://www.linkedin.com/in/marijn-stapert-05091182/',
      label: 'LinkedIn',
      icon: 'fa-brands fa-linkedin-in',
    },
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
