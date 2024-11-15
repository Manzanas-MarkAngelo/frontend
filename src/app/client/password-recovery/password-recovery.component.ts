import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminLoginService } from '../../../services/admin-login.service';
import { SnackbarComponent } from '../../admin/snackbar/snackbar.component';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css']
})
export class PasswordRecoveryComponent {
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;

  newPassword: string = '';
  confirmPassword: string = '';
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  token: string | null = null;
  showSuccessModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminLoginService: AdminLoginService,
  ) {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  isPasswordLongEnough(): boolean {
    return this.newPassword.length >= 8;
  }

  hasUpperAndLowerCase(): boolean {
    return /[A-Z]/.test(this.newPassword) && /[a-z]/.test(this.newPassword);
  }

  hasNumber(): boolean {
    return /\d/.test(this.newPassword);
  }

  hasSpecialCharacter(): boolean {
    return /[!@#$%^&*(),.?":{}|<>]/.test(this.newPassword);
  }

  passwordsMatch(): boolean {
    return this.newPassword === this.confirmPassword;
  }

  onSubmit() {
    if (!this.newPassword) {
      this.snackbar.showMessage("Please enter a new password.");
    } else if (
      !this.isPasswordLongEnough() || 
      !this.hasUpperAndLowerCase() || 
      !this.hasNumber() || 
      !this.hasSpecialCharacter()
    ) {
      this.snackbar.showMessage("Password requirements not met.");
    } else if (!this.passwordsMatch()) {
      this.snackbar.showMessage("Password mismatch. Please make sure both passwords match.");
    } else {
      this.adminLoginService.resetPassword(this.newPassword, this.token).subscribe(
        () => {
          this.showSuccessModal = true;
        },
        error => {
          this.snackbar.showMessage("Failed to reset password. Please try again.");
        }
      );
    }
  }  

  navigateToLogin() {
    this.showSuccessModal = false;
    window.location.href = '/administrator';
  }
}