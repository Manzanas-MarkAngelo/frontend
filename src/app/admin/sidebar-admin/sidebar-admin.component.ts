import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-admin',
  templateUrl: './sidebar-admin.component.html',
  styleUrls: ['./sidebar-admin.component.css']
})
export class SidebarAdminComponent {

  constructor(private router: Router) { }

  onLogoutClick() {
    this.router.navigate(['/logout-warning']);
  }
}