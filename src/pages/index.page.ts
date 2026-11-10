import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PostCard } from '../app/post-card';
import { loadPosts } from '../lib/posts';
import { mfstapertTitle } from '../lib/title';

export const routeMeta: RouteMeta = {
  title: mfstapertTitle(),
};

interface TerminalLine {
  command: boolean;
  text: string;
  at: number;
}

function terminal(lines: [command: boolean, text: string][]): TerminalLine[] {
  let at = 0.5;
  return lines.map(([command, text]) => {
    const line = { command, text, at };
    at += command ? text.length * 0.055 + 0.25 : 0.45;
    return line;
  });
}

@Component({
  selector: 'home',
  imports: [PostCard, RouterLink],
  template: `
    <section class="grid w-full items-center gap-12 md:grid-cols-[1.1fr_1fr]">
      <div>
        <p class="mb-medium font-mono text-sm text-primary">// hello, world</p>
        <h1
          class="mb-medium text-[clamp(2.75rem,7vw,4.5rem)] leading-[1.02] font-black tracking-tight"
        >
          Hi, I’m
          <span class="text-primary">Marijn Stapert</span>
        </h1>
        <p class="mb-large max-w-[40ch] text-xl">
          A <span class="font-semibold text-ink-strong">software engineer</span> living in the
          Netherlands and currently working at XIP. I build web apps, mostly in Angular and
          TypeScript, and like making teams faster.
        </p>
        <div class="flex flex-wrap gap-small">
          <a
            class="group inline-flex items-center gap-small rounded-full bg-primary px-6 py-3 font-semibold text-on-primary transition hover:text-on-primary hover:shadow-lg hover:shadow-primary/30"
            routerLink="/blog"
            >Read the blog
            <i
              class="fa-solid fa-arrow-right text-sm transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            ></i
          ></a>
          <a
            class="inline-flex items-center rounded-full border border-ink/30 px-6 py-3 font-semibold transition hover:border-primary"
            routerLink="/resume"
            >View resume</a
          >
        </div>
      </div>

      <div class="relative">
        <div
          class="absolute -inset-x-3 -inset-y-6 -z-10 md:-inset-6 rounded-[2rem] bg-linear-to-tr from-primary/30 via-transparent to-[#3f5bd8]/30 blur-2xl"
          aria-hidden="true"
        ></div>
        <figure
          class="overflow-hidden rounded-2xl border border-white/10 bg-terminal font-mono text-sm text-[#d4d4d4] shadow-2xl"
        >
          <div
            class="flex items-center gap-2 border-b border-white/10 px-medium py-3"
            aria-hidden="true"
          >
            <span class="size-3 rounded-full bg-[#ff5f57]"></span>
            <span class="size-3 rounded-full bg-[#febc2e]"></span>
            <span class="size-3 rounded-full bg-[#28c840]"></span>
            <span class="ml-auto text-xs text-[#8b949e]">~/mfstapert — zsh</span>
          </div>
          <div class="min-h-56 space-y-1 p-large leading-relaxed">
            @for (line of lines; track $index) {
              @if (line.command) {
                <p class="reveal" [style]="{ '--at': line.at + 's' }">
                  <span class="text-[#7ee787]">~</span>&ngsp;<span class="text-[#79c0ff]">$</span
                  >&ngsp;
                  <span class="type-line" [style]="{ '--chars': line.text.length }">{{
                    line.text
                  }}</span>
                </p>
              } @else {
                <p class="reveal text-[#8b949e]" [style]="{ '--at': line.at + 's' }">
                  <span class="whitespace-pre-wrap">{{ line.text }}</span>
                </p>
              }
            }
            <p class="reveal" [style]="{ '--at': end + 's' }">
              <span class="text-[#7ee787]">~</span>&ngsp;<span class="text-[#79c0ff]">$</span>&ngsp;
              <span
                class="cursor-blink inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-[#d4d4d4]"
                aria-hidden="true"
              ></span>
            </p>
          </div>
        </figure>
      </div>
    </section>

    <section class="mt-24 w-full">
      <div class="mb-large flex items-end justify-between gap-medium">
        <h2 class="text-h1"><span class="font-mono text-primary">#</span>Latest writing</h2>
        <a class="font-mono text-sm text-primary hover:underline" routerLink="/blog">all posts →</a>
      </div>
      <div class="grid gap-medium md:grid-cols-3">
        @for (post of latest; track post.slug) {
          <post-card [post]="post" />
        }
      </div>
    </section>
  `,
})
export default class HomePage {
  readonly latest = loadPosts().slice(0, 3);

  readonly lines = terminal([
    [true, 'whoami'],
    [false, 'Marijn Stapert, software engineer'],
    [true, 'cat now.txt'],
    [false, 'Senior frontend dev @ XIP, Deventer'],
    [true, 'ls stack/'],
    [false, 'angular  typescript  nx  kotlin  docker'],
  ]);

  readonly end = (this.lines.at(-1)?.at ?? 0) + 0.45;
}
