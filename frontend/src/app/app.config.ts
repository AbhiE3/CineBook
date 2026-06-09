import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { errorInterceptor } from "./core/interceptors/error.interceptor";
import { identityInterceptor } from "./core/interceptors/identity.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([identityInterceptor, errorInterceptor]))
  ]
};
