import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';

import { loadResume } from '../lib/resume-entries';
import { mfstapertTitle } from '../lib/title';

export const routeMeta: RouteMeta = {
  title: mfstapertTitle('resume'),
};

@Component({
  selector: 'resume',
  template: `
    <header class="mb-12 flex w-full flex-wrap items-center gap-large">
      <img
        class="size-28 rounded-2xl object-cover shadow-lg ring-4 ring-surface print:size-24 print:shadow-none"
        src="/assets/imgs/mugshot.jpg"
        alt="Portrait of Marijn Stapert"
      />
      <div class="min-w-60 flex-1">
        <h1 class="text-[clamp(2.25rem,5vw,3rem)] leading-tight font-black tracking-tight">
          Marijn Stapert
        </h1>
        <p class="font-mono text-primary">Senior frontend developer · Deventer</p>
      </div>
      <a
        class="group inline-flex items-center gap-small rounded-full border border-ink/30 px-6 py-3 font-semibold transition hover:border-primary print:hidden"
        href="/resume.pdf"
        download
        ><i
          class="fa-solid fa-download transition-transform group-hover:translate-y-0.5"
          aria-hidden="true"
        ></i>
        Download PDF</a
      >
    </header>

    <p class="mb-12 max-w-[65ch] text-lg print:max-w-none">
      Software engineer with ten years of experience building web applications, mostly in Angular
      and TypeScript, with a background in full-stack development in Java and Kotlin. I enjoy
      improving how teams work: architecture, test strategy, CI/CD pipelines and infrastructure.
      Currently a senior frontend developer at XIP, working for Thieme Meulenhoff.
    </p>

    <section class="mb-16 grid w-full gap-medium sm:grid-cols-2">
      @for (block of personalia; track block.heading) {
        <div class="rounded-2xl border bg-surface p-large print:break-inside-avoid">
          <h2 class="meta mb-medium tracking-widest uppercase">{{ block.heading }}</h2>
          <dl class="grid grid-cols-[auto_1fr] gap-x-medium gap-y-1">
            @for (row of block.rows; track row.label) {
              <dt class="text-muted" [class]="row.printOnly ? 'hidden print:block' : null">
                {{ row.label }}
              </dt>
              <dd
                class="font-semibold text-ink-strong"
                [class]="row.printOnly ? 'hidden print:block' : null"
              >
                {{ row.value }}
              </dd>
            }
          </dl>
        </div>
      }
    </section>

    <section class="w-full">
      <h2 class="mb-large text-h1"><span class="font-mono text-primary">#</span>Work experience</h2>

      <ol class="list-none border-l-2 pl-large">
        @for (job of jobs; track job.order) {
          <li
            class="relative mb-12 before:absolute before:top-1.5 before:-left-[calc(2rem+7px)] before:size-3 before:rounded-full before:bg-primary before:ring-4 before:ring-page last:mb-0"
          >
            <div class="mb-medium print:break-inside-avoid print:break-after-avoid">
              <p class="meta">{{ job.attributes.period }}</p>
              <h3 class="text-h2">
                {{ job.attributes.title }}
                @if (job.attributes.languages) {
                  <em class="text-muted">({{ job.attributes.languages }})</em>
                }
              </h3>
              <p class="font-semibold text-primary">{{ job.attributes.employer }}</p>
            </div>

            <div
              class="mb-medium max-w-[65ch] space-y-medium print:max-w-none"
              [innerHTML]="job.body"
            ></div>

            @if (job.attributes.activities) {
              <p class="meta mb-small tracking-widest uppercase print:break-after-avoid">
                Key activities
              </p>
              <ul class="mb-medium list-none space-y-1 print:break-inside-avoid">
                @for (activity of job.attributes.activities; track activity) {
                  <li
                    class="flex gap-small before:font-mono before:text-primary before:content-['▹']"
                  >
                    {{ activity }}
                  </li>
                }
              </ul>
            }
            @if (job.attributes.technology) {
              <p class="meta mb-small tracking-widest uppercase print:break-after-avoid">
                Technology
              </p>
              <ul class="flex list-none flex-wrap gap-small print:break-inside-avoid">
                @for (technology of job.attributes.technology; track technology) {
                  <li class="rounded-md border bg-surface px-small py-0.5 font-mono text-xs">
                    {{ technology }}
                  </li>
                }
              </ul>
            }
          </li>
        }
      </ol>
    </section>
  `,
})
export default class ResumePage {
  readonly personalia = [
    {
      heading: 'Personalia',
      rows: [
        { label: 'Date of birth', value: '18-09-1991' },
        { label: 'Residence', value: 'Deventer' },
        { label: 'Languages', value: 'Dutch, English' },
        { label: 'Email', value: 'mf.stapert@gmail.com', printOnly: true },
      ],
    },
    {
      heading: 'Education',
      rows: [
        { label: '2009', value: 'HAVO NT' },
        { label: '2016', value: 'Bachelor Software engineering' },
        { label: '2023', value: 'Certified Kubernetes Application Developer' },
      ],
    },
  ];

  readonly jobs = loadResume();
}
