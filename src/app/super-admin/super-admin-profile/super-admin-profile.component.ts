import { Component, OnInit } from '@angular/core';
import { SuperAdminService } from '../../../services/super-admin.service';
import { sha256 } from 'js-sha256';

@Component({
  selector: 'app-super-admin-profile',
  templateUrl: './super-admin-profile.component.html',
  styleUrls: ['./super-admin-profile.component.css']
})
export class SuperAdminProfileComponent implements OnInit {
  adminData: any = {};
  originalData: any = {};
  isEditMode = false;
  displayedPassword: string = '';
  passwordStage: string = 'enterCurrent';
  currentPasswordInput: string = '';
  newPasswordInput: string = '';
  confirmNewPasswordInput: string = '';
  currentPasswordVisible: boolean = false;
  newPasswordVisible: boolean = false;
  confirmNewPasswordVisible: boolean = false;
  showIncorrectPasswordModal: boolean = false;
  showPasswordConfirmedModal: boolean = false;
  showPasswordMismatchModal: boolean = false;
  showSaveChangesSuccessModal: boolean = false;

  constructor(private superAdminService: SuperAdminService) { }

  ngOnInit(): void {
    const adminId = 1;
    this.superAdminService.getSuperAdminById(adminId).subscribe(data => {
      this.adminData = data;
      this.originalData = { ...data };
      this.displayedPassword = '*'.repeat(8);
    });
  }

  toggleEditMode(): void {
    if (this.isEditMode) {
      this.saveChanges();
    } else {
      this.originalData = { ...this.adminData };
    }
    this.isEditMode = !this.isEditMode;
  }

  saveChanges(): void {
    const adminId = 1;
    const updatedAdminData = { ...this.adminData };
    if (this.passwordStage === 'complete') {
      updatedAdminData.newPassword = this.newPasswordInput;
    }
    this.superAdminService
      .updateSuperAdmin(adminId, updatedAdminData)
      .subscribe(response => {
        this.showSaveChangesSuccessModal = true;
    });
  }

  cancelChanges(): void {
    this.adminData = { ...this.originalData };
    this.isEditMode = false;
    this.passwordStage = 'enterCurrent';
  }

  toggleCurrentPasswordVisibility(): void {
    this.currentPasswordVisible = !this.currentPasswordVisible;
  }

  toggleNewPasswordVisibility(): void {
    this.newPasswordVisible = !this.newPasswordVisible;
  }

  toggleConfirmNewPasswordVisibility(): void {
    this.confirmNewPasswordVisible = !this.confirmNewPasswordVisible;
  }

  hideIncorrectPasswordModal(): void {
    this.showIncorrectPasswordModal = false;
  }

  hidePasswordConfirmedModal(): void {
    this.showPasswordConfirmedModal = false;
  }

  hidePasswordMismatchModal(): void {
    this.showPasswordMismatchModal = false;
  }

  hideSaveChangesSuccessModal(): void {
    this.showSaveChangesSuccessModal = false;
    window.location.reload();
  }

  isPasswordLongEnough(): boolean {
    return this.newPasswordInput.length >= 8;
  }

  hasUpperAndLowerCase(): boolean {
    return /[A-Z]/.test(this.newPasswordInput) && /[a-z]/.test(this.newPasswordInput);
  }

  hasNumber(): boolean {
    return /\d/.test(this.newPasswordInput);
  }

  hasSpecialCharacter(): boolean {
    return /[!@#$%^&*(),.?":{}|<>]/.test(this.newPasswordInput);
  }

  handlePasswordInput(): void {
    if (this.passwordStage === 'enterCurrent') {
      const hashedCurrentPassword = sha256(this.currentPasswordInput);
      if (hashedCurrentPassword === this.adminData.password) {
        this.passwordStage = 'enterNew';
        this.currentPasswordInput = '';
      } else {
        this.showIncorrectPasswordModal = true;
      }
    } else if (this.passwordStage === 'enterNew') {
      if (
        this.isPasswordLongEnough() && 
        this.hasUpperAndLowerCase() && 
        this.hasNumber() && 
        this.hasSpecialCharacter()
      ) {
        this.passwordStage = 'confirmNew';
      }
    } else if (this.passwordStage === 'confirmNew') {
      if (this.newPasswordInput === this.confirmNewPasswordInput) {
        this.adminData.password = this.newPasswordInput;
        this.showPasswordConfirmedModal = true;
        this.passwordStage = 'complete';
      } else {
        this.showPasswordMismatchModal = true;
      }
    }
  }
}