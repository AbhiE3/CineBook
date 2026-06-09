import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";

/**
 * Replaces JWT: attaches the signed-in user's identity as request headers
 * so the backend can scope data without tokens. No-op for anonymous calls.
 */
export const identityInterceptor: HttpInterceptorFn = (req, next) => {
  const user = inject(AuthService).currentUser();
  if (!user) {
    return next(req);
  }
  const authedReq = req.clone({
    setHeaders: {
      "X-User-Id": String(user.id),
      "X-Role": user.role
    }
  });
  return next(authedReq);
};
