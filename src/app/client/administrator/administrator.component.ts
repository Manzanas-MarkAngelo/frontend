import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AdminLoginService } from '../../../services/admin-login.service';
import { AdminService } from '../../../services/admin.service';
import { EmailService } from '../../../services/email.service';
import { SnackbarComponent } from '../../admin/snackbar/snackbar.component';

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
  recoverySent = false;
  emailInput: string = '';
  showSnackbar: boolean = false;
  snackbarMessage: string = '';
  isProcessing: boolean = false;

  @ViewChild(SnackbarComponent) snackbar: SnackbarComponent;
  @ViewChild('forgotPasswordModal') forgotPasswordModal!: ElementRef;

  constructor(
    private adminLoginService: AdminLoginService,
    private emailService: EmailService,
    private adminService: AdminService,
    private router: Router
  ) {}

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  openForgotPasswordModal() {
    this.forgotPasswordModal.nativeElement.showModal();
  }

  closeForgotPasswordModal() {
    this.forgotPasswordModal.nativeElement.close();
    this.emailInput = '';
  }

  showSnackbarMessage(message: string) {
    this.snackbarMessage = message;
    this.showSnackbar = true;
    setTimeout(() => {
      this.showSnackbar = false;
    }, 3000);
  }

  checkEmail() {
    if (!this.emailInput.trim()) {
      this.showSnackbarMessage("Please enter your email address.");
      return;
    }
  
    this.adminLoginService.checkEmail(this.emailInput).subscribe(response => {
      if (response.found) {
        this.sendRecovery();
      } else {
        this.showSnackbarMessage("Email Not Found");
      }
    });
  }  

  sendRecovery() {
    this.isProcessing = true;
    this.emailService.sendRecoveryEmail(this.emailInput).subscribe(
      response => {
        this.isProcessing = false;
        this.recoverySent = true;
        this.snackbar.showMessage("Recovery email sent successfully!");
        this.closeForgotPasswordModal();
      },
      error => {
        this.isProcessing = false;
        this.snackbar.showMessage("Failed to send recovery email. Please try again.");
      }
    );
  }

  onSubmit() {
    this.adminLoginService.login(this.username, this.password).subscribe(response => {
      if (response.success) {
        this.adminLoginService.setSession(response.role);

        if (response.role === 'admin') {
          this.adminService.setRole('admin');
          this.router.navigate(['/super-admin-home']);  
        } else if (response.role === 'librarian') {
          this.adminService.setRole('librarian');
          this.router.navigate(['/analytics']);
        }
      } else {
        this.loginError = 'Invalid username or password';
      }
    }, error => {
      this.loginError = 'An error occurred. Please try again later.';
    });
  }
}