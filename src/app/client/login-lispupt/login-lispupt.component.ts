import { Component } from '@angular/core';

@Component({
  selector: 'app-login-lispupt',
  templateUrl: './login-lispupt.component.html',
  styleUrl: './login-lispupt.component.css'
})
export class LoginLispuptComponent {
  passwordVisible: boolean = false;

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
