import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
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
export class App {}
