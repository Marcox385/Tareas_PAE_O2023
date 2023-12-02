import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class UnauthGuard implements CanActivate {

  constructor (private tokenService: TokenService, private router: Router) {};

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      if (!this.tokenService.isLoggedIn()) {
        return true;
      }

      this.router.navigate(['login']);
      return false;
  }

}
