import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenService } from './../services_login/token.service';
import { AuthService } from './../services_login/auth.service';

// export const AuthGuard = () => {
//   const tokenService = new TokenService();
//   const router = new Router();

//   const token = tokenService.getToken();
//   if (token) {
//     return true;
//   } else {
//     return router.parseUrl('/home');
//   }
// };
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private tokenService: TokenService,
    private authService: AuthService,
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    //const token = this.tokenService.getToken();
    // if (token) {
    //   return true;
    // } else {
    //   return this.router.navigate(['/home']);
    // }
    return this.authService.user$.pipe(
      map(user => {
        if (!user) {
          this.router.navigate(['/home']);
          return false;
        }
        return true;
      }),
    );
  }
}
