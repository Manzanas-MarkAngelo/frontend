import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrl: './navbar-admin.component.css'
})
export class NavbarAdminComponent {

  constructor(private router: Router) { }

  onLogoutClick() {
    this.router.navigate(['/logout-warning']);
  }
}
