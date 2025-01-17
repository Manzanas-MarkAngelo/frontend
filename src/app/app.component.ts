import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { Router, NavigationEnd } from '@angular/router';
import { AdminHomeService } from '../services/admin-home.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  userRole: string | null = null;
  showNavbar = true;
  filter = false;
  
  excludedRoutes: string[] = ['/feedback', 
                              '/password-recovery', 
                              '/library-closed']; 

  constructor(private adminService: AdminService, 
              private router: Router,
              private adminHomeService: AdminHomeService) {}

  ngOnInit() {
    this.adminService.currentRole.subscribe(role => {
      this.userRole = role;
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = !this.excludedRoutes.some(route => event.urlAfterRedirects.startsWith(route));
      }
    });   

    // Check if current time is within library hours using the service method
    this.adminHomeService.isLibraryOpen().subscribe(isOpen => {
      if (!isOpen) {
        this.router.navigate(['/not-open']);
        console.log("Library is closed");
      }
    });
  }

  clearRole() {
    this.adminService.setRole(null);
  }
}
