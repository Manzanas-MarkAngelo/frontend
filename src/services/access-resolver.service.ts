import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { ClientLoginService } from './client-login.service';

@Injectable({
  providedIn: 'root'
})
export class AccessResolverService implements Resolve<string> {
  constructor(private clientLoginService: ClientLoginService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): string {
    return this.clientLoginService.getClientAccess() ? '/time-in' : '/login-lispupt';
  }
}
