import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-super-sidebar',
  templateUrl: './super-sidebar.component.html',
  styleUrl: './super-sidebar.component.css'
})
export class SuperSidebarComponent {
  constructor(private router: Router) { }

  onLogoutClick() {
    this.router.navigate(['/logout-warning']);
  }
}