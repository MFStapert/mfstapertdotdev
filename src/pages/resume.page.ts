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
    <h1 class="sr-only">Resume</h1>

    <p class="mb-large w-full print:hidden">
      <a class="inline-block rounded border px-medium py-small" href="/resume.pdf" download
        ><i class="fa-solid fa-download" aria-hidden="true"></i> Download PDF</a
      >
    </p>

    <section class="mb-large grid w-full grid-cols-[50%] gap-y-medium narrow:inline">
      <img
        class="col-start-1 row-span-2 box-content size-50 self-center rounded border narrow:hidden"
        src="/assets/imgs/mugshot.jpg"
        alt="Portrait of Marijn Stapert"
      />

      @for (block of personalia; track block.heading) {
        <div class="col-start-2 border-l pl-medium">
          <h2 class="my-small text-h3 underline">{{ block.heading }}:</h2>
          @for (row of block.rows; track row.label) {
            <p>
              {{ row.label }}: <span class="text-primary">{{ row.value }}</span>
            </p>
          }
        </div>
      }
    </section>

    <section class="w-full">
      <h2 class="mb-large text-h1">Work experience:</h2>

      @for (job of jobs; track job.order) {
        <div class="mb-large border-l pl-medium">
          <div class="mb-medium print:break-inside-avoid print:break-after-avoid">
            <h3 class="text-h2 text-primary">
              {{ job.attributes.title }}
              @if (job.attributes.languages) {
                <em> ({{ job.attributes.languages }})</em>
              }
            </h3>
            {{ job.attributes.period }}:
            <span class="text-primary">{{ job.attributes.employer }}</span>
          </div>

          <article
            class="mb-medium inline-block space-y-medium md:w-[65%] print:w-full"
            [innerHTML]="job.body"
          ></article>

          @if (job.attributes.activities) {
            <p class="text-primary print:break-after-avoid">Key activities:</p>
            <ul class="pt-small pb-medium leading-[1.4]">
              @for (activity of job.attributes.activities; track activity) {
                <li>{{ activity }}</li>
              }
            </ul>
          }
          @if (job.attributes.technology) {
            <p class="text-primary print:break-after-avoid">Technology:</p>
            <ul class="columns-3 gap-x-5 pt-small pb-medium leading-[1.4] print:break-inside-avoid">
              @for (technology of job.attributes.technology; track technology) {
                <li>{{ technology }}</li>
              }
            </ul>
          }
        </div>
      }
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
