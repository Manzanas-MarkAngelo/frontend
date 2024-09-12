import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminLoginService } from '../../../services/admin-login.service';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css']
})
export class AdministratorComponent {
  username: string = '';
  password: string = '';
  loginError: string | null = null;
  passwordVisible: boolean = false;

  constructor(
    private adminLoginService: AdminLoginService,
    private adminService: AdminService,
    private router: Router
  ) {}

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit() {
    this.adminLoginService.login(this.username, this.password).subscribe(response => {
      if (response.success) {
        if (response.role === 'librarian') {
          this.adminService.setRole('librarian');
        } else if (response.role === 'admin') {
          this.adminService.setRole('admin');
        }
        this.router.navigate(['/analytics']);
      } else {
        this.loginError = 'Invalid username or password';
      }
    });
  }
}