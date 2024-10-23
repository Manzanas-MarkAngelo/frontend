// import { Component, OnInit } from '@angular/core';
// import { AdminService } from '../services/admin.service';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent implements OnInit {
//   userRole: string | null = null;
//   filter = false;

//   constructor(private adminService: AdminService) {}

//   ngOnInit() {
//     this.adminService.currentRole.subscribe(role => {
//       this.userRole = role;
//     });
//   }

//   clearRole() {
//     this.adminService.setRole(null);
//   }
// }

import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  userRole: string | null = null;
  showNavbar = true;
  filter = false;
  
  // Define routes where the navbar should be hidden
  excludedRoutes: string[] = ['/login-lispupt', '/feedback']; 

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit() {
    this.adminService.currentRole.subscribe(role => {
      this.userRole = role;
    });

    // Listen to router events to check if current route should hide the navbar
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Toggle navbar visibility based on the current route
        this.showNavbar = !this.excludedRoutes.includes(event.urlAfterRedirects);
      }
    });
  }

  clearRole() {
    this.adminService.setRole(null);
  }
}
