import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AdminLoginService } from '../../../services/admin-login.service'; // Import the login service
import { AdminService } from '../../../services/admin.service';
@Component({
  selector: 'app-logout-warning',
  templateUrl: './logout-warning.component.html',
  styleUrls: ['./logout-warning.component.css']
})
export class LogoutWarningComponent {

  constructor(
    private location: Location, 
    private router: Router, 
    private adminLoginService: AdminLoginService,
    private adminService: AdminService
  ) { }

  onBack() {
    this.location.back(); // Navigate back to the previous page
  }

  onContinue() {
    this.adminLoginService.logout(); // Call the logout method to clear session
    this.adminService.setRole(null);
    this.router.navigate(['/']); // Redirect to home or login page
  }
}
