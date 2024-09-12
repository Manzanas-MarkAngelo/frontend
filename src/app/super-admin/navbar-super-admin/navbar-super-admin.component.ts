import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-super-admin',
  templateUrl: './navbar-super-admin.component.html',
  styleUrl: './navbar-super-admin.component.css'
})
export class NavbarSuperAdminComponent {
  constructor(private router: Router) { }

  onLogoutClick() {
    this.router.navigate(['/logout-warning']);
  }
}
