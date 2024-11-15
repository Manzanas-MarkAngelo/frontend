import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AdminLoginService } from './admin-login.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private adminLoginService: AdminLoginService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Check if user is logged in
    if (this.adminLoginService.isLoggedIn()) {
      const userRole = this.adminLoginService.getRole(); // Get the user's role

      // Optional: Check if the route requires a specific role
      if (route.data?.role && route.data.role !== userRole) {
        // If user doesn't have the right role
        this.router.navigate(['/forbidden']);
        return false;
      }
      return true; // User is logged in and has the correct role
    } else {
      // If not logged in, redirect to login page
      this.router.navigate(['/administrator']);
      return false;
    }
  }
}
