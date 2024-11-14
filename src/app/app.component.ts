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
  
  excludedRoutes: string[] = ['/feedback', '/password-recovery']; 

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit() {
    this.adminService.currentRole.subscribe(role => {
      this.userRole = role;
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = !this.excludedRoutes.some(route => event.urlAfterRedirects.startsWith(route));
      }
    });    
  }

  clearRole() {
    this.adminService.setRole(null);
  }
}
