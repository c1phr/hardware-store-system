import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(private _authService: AuthService,
              private _router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authenticate(route.routeConfig?.path, state.url);
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authenticate(childRoute.routeConfig?.path, state.url);
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authenticate(route.path, '/'+segments[0]?.toString()+'/'+segments[1]?.toString());
  }

  private authenticate(root_path: string | undefined, full_path: string): boolean {
    if(!this._authService.isLoggedIn()) {
      return ((root_path == 'auth') && ((full_path.includes('login')) || (full_path.includes('registrar')) || (full_path.includes('reset-password'))))
        ? (true)
        : ((root_path == 'staff') && ((full_path.includes('login'))))
          ? (true)
          : ((root_path == 'inicio') && ((full_path.includes('perfil'))))
            ? ((this._router.navigateByUrl('/auth/login')), false)
            : ((this._router.navigateByUrl('/auth/login')), false)
    }
    else {
      return ((root_path == 'auth') && ((full_path.includes('login')) || (full_path.includes('registrar')) || (full_path.includes('reset-password')))) 
        ? (this._router.navigateByUrl(`/inicio`), false)
        : ((root_path) && (root_path == 'staff') && ((full_path.includes(this._authService.getType()))))
          ? (true)
          : (this._router.navigateByUrl(`/inicio`), false)
    }
  }
}
