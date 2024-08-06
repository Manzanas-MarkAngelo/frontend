import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-logout-warning',
  templateUrl: './logout-warning.component.html',
  styleUrls: ['./logout-warning.component.css']
})
export class LogoutWarningComponent {

  constructor(private location: Location, private router: Router, private adminService: AdminService) { }

  onBack() {
    this.location.back();
  }

  onContinue() {
    this.adminService.setRole(null);
    this.router.navigate(['/']);
  }
}