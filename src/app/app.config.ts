import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { routes } from './app-routing.module';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EnvService } from './shared/services/env-service/env.service';
import { rootReducer } from './shared/components/engagement-details/engagement-state/reducers';
import { ErrorInterceptor } from './core/error.interceptor';

const env = EnvService.env;

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(
      StoreModule.forRoot(rootReducer, { metaReducers: [] }),
      StoreDevtoolsModule.instrument({
        maxAge: 25,
        logOnly: env.production
      })
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ]
};
