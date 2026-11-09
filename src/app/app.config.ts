import { provideContent, withMarkdownRenderer } from '@analogjs/content';
import { provideFileRouter, requestContextInterceptor } from '@analogjs/router';
import { APP_BASE_HREF } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideFileRouter(),
    provideHttpClient(withInterceptors([requestContextInterceptor])),
    provideClientHydration(withEventReplay()),
    provideContent(withMarkdownRenderer()),
    { provide: APP_BASE_HREF, useValue: '/' },
  ],
};
