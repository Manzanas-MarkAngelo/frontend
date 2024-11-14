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
  showSnackbar: boolean = false; // Variable to control snackbar visibility
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

  // Toggle the visibility of the password
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  openForgotPasswordModal() {
    this.forgotPasswordModal.nativeElement.showModal();
  }

  closeForgotPasswordModal() {
    this.forgotPasswordModal.nativeElement.close();
    this.emailInput = ''; // Reset the email input field when modal closes
  }

  showSnackbarMessage(message: string) {
    this.snackbarMessage = message;
    this.showSnackbar = true;
    setTimeout(() => {
      this.showSnackbar = false;
    }, 3000); // Hide after 3 seconds
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
    this.isProcessing = true; // Start loading only when sending recovery email
    this.emailService.sendRecoveryEmail(this.emailInput).subscribe(
      response => {
        this.isProcessing = false; // Stop loading
        this.recoverySent = true;
        this.snackbar.showMessage("Recovery email sent successfully!");
        this.closeForgotPasswordModal();
      },
      error => {
        this.isProcessing = false; // Stop loading
        this.snackbar.showMessage("Failed to send recovery email. Please try again.");
      }
    );
  }

  onSubmit() {
    this.adminLoginService.login(this.username, this.password).subscribe(response => {
      if (response.success) {
        // Set the session based on the role
        this.adminLoginService.setSession(response.role);

        // Navigate to the appropriate page based on role
        if (response.role === 'admin') {
          this.adminService.setRole('admin');
          this.router.navigate(['/analytics']);  
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
