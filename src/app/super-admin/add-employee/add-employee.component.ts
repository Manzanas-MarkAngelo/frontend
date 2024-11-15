import { Component, ViewChild } from '@angular/core';
import { RegisterService } from '../../../services/register.service';
import { SnackbarComponent } from '../../admin/snackbar/snackbar.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent {
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;

  selectedRole: string = 'pupt-employee';
  empNum: string = '';
  contact: string = '';
  sex: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';

  isEmpNumValid: boolean = true;
  empNumError: string = '';
  isUserExists: boolean = false;
  userExistsError: string = '';
  isContactValid: boolean = true;
  contactError: string = '';
  isContactExists: boolean = false;
  contactExistsError: string = '';
  isEmailValid: boolean = true;
  emailError: string = '';
  hasFormErrors: boolean = false;

  fieldErrors: { [key: string]: boolean } = {};

  constructor(
    private registerService: RegisterService,
    private location: Location
  ) {}

  capitalizeFirstLetter(value: string): string {
    if (!value) return value;

    return value
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  validateEmpNum(): boolean {
    const empNumPattern = /^\d{5}$/;
    if (!this.empNum.match(empNumPattern)) {
      this.isEmpNumValid = false;
      this.empNumError = 'Invalid Employee number format.';
      return false;
    }
    this.isEmpNumValid = true;
    this.empNumError = '';
    return true;
  }

  validateContact(): boolean {
    const contactPattern = /^09\d{9}$/;
    if (!this.contact.match(contactPattern)) {
      this.isContactValid = false;
      this.contactError = 'Invalid contact number format.';
      return false;
    }
    this.isContactValid = true;
    this.contactError = '';
    return true;
  }

  validateEmail(): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email.match(emailPattern)) {
      this.isEmailValid = false;
      this.emailError = 'Invalid email format.';
      return false;
    }
    this.isEmailValid = true;
    this.emailError = '';
    return true;
  }

  validateRequiredFields(): boolean {
    return !!this.empNum && 
             !!this.sex && 
             !!this.firstName && 
             !!this.lastName && 
             !!this.contact && 
             !!this.email;
  }

  onFieldInput(field: string) {
    this.fieldErrors[field] = false;
  
    if (field === 'empNum') {
      this.isEmpNumValid = true;
      this.isUserExists = false;
    } else if (field === 'contact') {
      this.isContactValid = true;
      this.isContactExists = false;
    } else if (field === 'email') {
      this.isEmailValid = true;
      this.isContactExists = false;
    }

    if (this.allFieldsValid()) {
      this.hasFormErrors = false;
    }
  }

  allFieldsValid(): boolean {
    return this.empNum.trim() !== '' &&
             this.sex.trim() !== '' &&
             this.firstName.trim() !== '' &&
             this.lastName.trim() !== '' &&
             this.contact.trim() !== '' &&
             this.email.trim() !== '';
  }

  onSubmit() {
    this.isEmpNumValid = true;
    this.isContactValid = true;
    this.isEmailValid = true;
    this.isUserExists = false;
    this.isContactExists = false;
    this.hasFormErrors = false;

    let formIsValid = true;

    if (!this.validateRequiredFields()) {
      this.hasFormErrors = true;
      return;
    }

    if (!this.validateEmpNum()) {
      formIsValid = false;
    }

    if (!this.validateContact()) {
      formIsValid = false;
    }

    if (!this.validateEmail()) {
      formIsValid = false;
    }

    this.checkIfUserExistsAndContact(this.empNum, this.contact);
  }

  checkIfUserExistsAndContact(empNum: string, contact: string) {
    const identifierCheck = this.registerService
      .checkUserExists('pupt-employee', empNum, '').toPromise();
    const contactCheck = this.registerService
      .checkUserExists('pupt-employee', '', contact).toPromise();

    Promise.all([identifierCheck, contactCheck])
      .then((results) => {
        const [identifierResponse, contactResponse] = results;

        this.isUserExists = false;
        this.isContactExists = false;

        if (identifierResponse.registered) {
          if (identifierResponse.message.includes('identifier')) {
            this.isUserExists = true;
            this.userExistsError = 'Employee number is already registered.';
          }
        }

        if (contactResponse.registered) {
          if (contactResponse.message.includes('contact')) {
            this.isContactExists = true;
            this.contactExistsError = 'Contact number is already registered.';
          }
        }

        if (
          this.isUserExists || 
          this.isContactExists || 
          !this.isEmpNumValid ||
          !this.isContactValid || 
          !this.isEmailValid
        ) {
          return;
        }

        this.openConfirmationModal();
      })
      .catch((error) => {
        console.error('Error checking user or contact:', error);
        this.isUserExists = false;
        this.isContactExists = false;
      });
  }

  openConfirmationModal() {
    (document.getElementById('my_modal_1') as HTMLDialogElement).showModal();
  }

  closeConfirmationModal() {
    (document.getElementById('my_modal_1') as HTMLDialogElement).close();
  }

  submitForm() {
    this.firstName = this.capitalizeFirstLetter(this.firstName);
    this.lastName = this.capitalizeFirstLetter(this.lastName);
    this.email = this.email.toLowerCase();

    const formData: any = {
      selectedRole: this.selectedRole,
      empNum: this.empNum,
      sex: this.sex,
      firstName: this.firstName,
      lastName: this.lastName,
      contact: this.contact,
      email: this.email,
    };

    this.registerService.registerUser(formData).subscribe((response) => {
      if (response.status === 'success') {
        this.closeConfirmationModal();
        this.snackbar.showMessage('Employee added successfully!');

        setTimeout(() => {
          this.goBack();
        }, 1000);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}