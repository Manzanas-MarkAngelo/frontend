import { Component } from '@angular/core';
import { AdminLoginService } from '../../../services/admin-login.service';
import { ClientLoginService } from '../../../services/client-login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-lispupt',
  templateUrl: './login-lispupt.component.html',
  styleUrls: ['./login-lispupt.component.css'],
})
export class LoginLispuptComponent {
  username: string = '';
  password: string = '';
  passwordVisible: boolean = false;
  loginError: string = '';

  constructor(
    private adminLoginService: AdminLoginService,
    private clientLoginService: ClientLoginService,
    private router: Router
  ) {}

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(event: Event) {
    event.preventDefault();

    this.adminLoginService.loginClient(this.username, this.password).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.clientLoginService.setClientAccess(true); // Set client access to true
          this.router.navigate(['/time-in']);
        } else {
          this.loginError = response.message || 'Login failed';
        }
      },
      error: () => {
        this.loginError = 'An error occurred. Please try again.';
      },
    });
  }
}
