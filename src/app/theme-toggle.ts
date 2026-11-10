import { DOCUMENT } from '@angular/common';
import { Component, afterNextRender, inject, signal } from '@angular/core';

@Component({
  selector: 'theme-toggle',
  template: `
    <button
      type="button"
      class="grid size-10 place-items-center rounded-full border bg-surface text-ink transition hover:rotate-12 hover:border-primary hover:text-primary motion-reduce:hover:rotate-0"
      [attr.aria-pressed]="dark()"
      aria-label="Dark mode"
      (click)="toggle()"
    >
      <i class="fa-solid" [class.fa-moon]="!dark()" [class.fa-sun]="dark()" aria-hidden="true"></i>
    </button>
  `,
})
export class ThemeToggle {
  private readonly root = inject(DOCUMENT).documentElement;
  readonly dark = signal(false);

  constructor() {
    afterNextRender(() => {
      this.dark.set(this.root.classList.contains('dark'));
    });
  }

  toggle(): void {
    const dark = !this.dark();
    this.dark.set(dark);
    this.root.classList.toggle('dark', dark);
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {
      // Private mode: the choice just doesn't persist.
    }
  }
}
