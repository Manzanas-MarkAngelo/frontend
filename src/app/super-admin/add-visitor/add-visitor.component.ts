import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../../../services/register.service';
import { Location } from '@angular/common';
import { SnackbarComponent } from '../../admin/snackbar/snackbar.component';

@Component({
  selector: 'app-add-visitor',
  templateUrl: './add-visitor.component.html',
  styleUrls: ['./add-visitor.component.css']
})
export class AddVisitorComponent {
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;

  selectedRole: string = 'visitor';
  contact: string = '';
  sex: string = '';
  firstName: string = '';
  lastName: string = '';
  school: string = '';
  identifier: string = '';

  isUserExists: boolean = false;
  userExistsError: string = '';
  isContactValid: boolean = true;
  contactError: string = '';
  isContactExists: boolean = false;
  contactExistsError: string = '';
  hasFormErrors: boolean = false;

  fieldErrors: { [key: string]: boolean } = {};

  constructor(
    private registerService: RegisterService,
    private location: Location,
    private router: Router
  ) {}

  capitalizeFirstLetter(value: string): string {
    if (!value) return value;

    return value
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
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

  validateRequiredFields(): boolean {
    return !!this.school && 
           !!this.sex && 
           !!this.firstName && 
           !!this.lastName && 
           !!this.identifier && 
           !!this.contact;
  }

  onFieldInput(field: string) {
    this.fieldErrors[field] = false;
  
    if (field === 'contact') {
      this.isContactValid = true;
      this.isContactExists = false;
    }

    if (field === 'identifier') {
      this.isUserExists = false;
      this.userExistsError = '';
    }

    if (this.allFieldsValid()) {
      this.hasFormErrors = false;
    }
  }

  allFieldsValid(): boolean {
    return this.school.trim() !== '' &&
           this.sex.trim() !== '' &&
           this.firstName.trim() !== '' &&
           this.lastName.trim() !== '' &&
           this.identifier.trim() !== '' &&
           this.contact.trim() !== '';
  }

  onSubmit() {
    this.isContactValid = true;
    this.isUserExists = false;
    this.isContactExists = false;
    this.hasFormErrors = false;

    let formIsValid = true;

    if (!this.validateRequiredFields()) {
      this.hasFormErrors = true;
      return;
    }

    if (!this.identifier) {
      this.isUserExists = true;
      this.userExistsError = 'Visitor identifier is required.';
      formIsValid = false;
    }

    if (!this.validateContact()) {
      formIsValid = false;
    }

    this.checkIfUserExistsAndContact(this.identifier, this.contact);
  }

  checkIfUserExistsAndContact(identifier: string, contact: string) {
    const identifierCheck = this.registerService
      .checkUserExists('visitor', identifier, '').toPromise();
    const contactCheck = this.registerService
      .checkUserExists('visitor', '', contact).toPromise();

    Promise.all([identifierCheck, contactCheck])
      .then((results) => {
        const [identifierResponse, contactResponse] = results;

        this.isUserExists = false;
        this.isContactExists = false;

        if (identifierResponse.registered) {
          if (identifierResponse.message.includes('identifier')) {
            this.isUserExists = true;
            this.userExistsError = 'Visitor identifier is already registered.';
          }
        }

        if (contactResponse.registered) {
          if (contactResponse.message.includes('contact')) {
            this.isContactExists = true;
            this.contactExistsError = 'Contact number is already registered.';
          }
        }

        if (this.isUserExists || this.isContactExists || !this.isContactValid) {
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

    const formData: any = {
      selectedRole: this.selectedRole,
      identifier: this.identifier,
      sex: this.sex,
      firstName: this.firstName,
      lastName: this.lastName,
      school: this.school,
      contact: this.contact
    };

    this.registerService.registerUser(formData).subscribe((response) => {
      if (response.status === 'success') {
        this.closeConfirmationModal();
        this.snackbar.showMessage('Visitor added successfully!');

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