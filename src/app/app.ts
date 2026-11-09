import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, skip } from 'rxjs';

@Component({
  selector: 'root',
  imports: [RouterLink, RouterOutlet],
  preserveWhitespaces: true,
  template: `
    <header>
      <div class="page-container">
        <h1 class="flex-[1_1_50%] py-large">
          <a class="group hover:text-dark-grey hover:no-underline" routerLink="/"
            >{{ '{' }} <span class="text-primary group-hover:underline">mfstapert</span>;
            {{ '}' }}</a
          >
        </h1>
        <nav class="flex flex-[1_1_50%] flex-row-reverse">
          <ul class="mt-8.5">
            @for (link of navLinks; track link.path) {
              <li class="inline-block">
                <a class="px-large text-lg/[30px]" [routerLink]="link.path">{{ link.label }}</a>
              </li>
            }
          </ul>
        </nav>
      </div>
    </header>

    <main class="border-y bg-light-grey p-large">
      <div class="page-container">
        <router-outlet />
      </div>
    </main>

    <footer class="p-large">
      <div class="page-container">
        <h2 class="w-full">
          <span class="text-primary">Want to get in touch? </span>Find me here:
        </h2>
        <div class="py-medium text-[1.875rem]/none *:pr-large">
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
