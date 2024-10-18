import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  userRole: string | null = null;
  filter = false;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.currentRole.subscribe(role => {
      this.userRole = role;
    });
  }

  clearRole() {
    this.adminService.setRole(null);
  }
}