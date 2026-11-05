import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouteMeta } from '@analogjs/router';

import { loadResume } from '../resume-entries';
import { mfstapertTitle } from '../title';

export const routeMeta: RouteMeta = {
  title: mfstapertTitle('resume'),
};

@Component({
  selector: 'app-resume',
  template: `
    <section class="resume-section resume-personalia">
      <img src="/assets/imgs/mugshot.jpg" alt="Marijn Stapert" />

      <div class="personalia">
        <h3 class="underline">Personalia:</h3>
        <p>Date of birth: <span class="color-primary">18-09-1991</span></p>
        <p>Residence: <span class="color-primary">Deventer</span></p>
      </div>

      <div class="personalia">
        <h3 class="underline">Education:</h3>
        <p>2009: <span class="color-primary">HAVO NT</span></p>
        <p>2016: <span class="color-primary">Bachelor Software engineering</span></p>
        <p>2023: <span class="color-primary">Certified Kubernetes Application Developer</span></p>
      </div>
    </section>

    <section class="resume-section">
      <h1>Work experience:</h1>

      @for (job of jobs; track job.order) {
        <div class="resume-experience">
          <div class="resume-experience-header">
            <h2 class="color-primary">
              {{ job.attributes.title }}
              @if (job.attributes.languages) {
                <em> ({{ job.attributes.languages }})</em>
              }
            </h2>
            {{ job.attributes.period }}:
            <span class="color-primary">{{ job.attributes.employer }}</span>
          </div>

          <article [innerHTML]="asHtml(job.body)"></article>

          @if (job.attributes.activities) {
            <p class="color-primary">Key activities:</p>
            <ul>
              @for (activity of job.attributes.activities; track activity) {
                <li>{{ activity }}</li>
              }
            </ul>
          }
          @if (job.attributes.technology) {
            <p class="color-primary">Technology:</p>
            <ul class="multi-column">
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
  private readonly sanitizer = inject(DomSanitizer);
  readonly jobs = loadResume();

  asHtml(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
