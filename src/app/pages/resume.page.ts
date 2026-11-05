import { Component } from '@angular/core';
import { RouteMeta } from '@analogjs/router';

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
    </section>
  `,
})
export default class ResumePage {}
