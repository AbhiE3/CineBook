import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";

/**
 * On 401 Unauthorized, clear the session and bounce to /login —
 * the stateless equivalent of "token expired, log back in".
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return next(req).pipe(
    catchError((err) => {
      if (err.status === 401 && auth.isLoggedIn()) {
        auth.logout();
        router.navigate(["/login"]);
      }
      return throwError(() => err);
    })
  );
};
