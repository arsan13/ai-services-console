import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideMarkdown } from 'ngx-markdown';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { apiResponseInterceptor } from './core/interceptors/api-response.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    importProvidersFrom(MatSnackBarModule),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, apiResponseInterceptor])
    ),
    provideMarkdown()
  ]
};
