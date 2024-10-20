import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../../../services/register.service';
import { DepartmentService } from '../../../services/department.service';
import { SnackbarComponent } from '../../admin/snackbar/snackbar.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-faculty',
  templateUrl: './add-faculty.component.html',
  styleUrls: ['./add-faculty.component.css']
})
export class AddFacultyComponent implements OnInit {
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;

  selectedRole: string = 'faculty';
  empNumber: string = '';
  sex: string = '';
  firstName: string = '';
  lastName: string = '';
  department: string = '';
  contact: string = '';
  email: string = '';
  departments: any[] = [];

  isEmpNumberValid: boolean = true;
  empNumberError: string = '';
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
    private router: Router,
    private location: Location,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments() {
    this.departmentService.getDepartments().subscribe(data => {
      this.departments = data;
    }, error => {
      console.error('Error fetching departments:', error);
    });
  }

  capitalizeFirstLetter(value: string): string {
    if (!value) return value;

    return value
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  validateEmpNumber(): boolean {
    const empNumberPattern = /^FA\d{4}TG\d{4}$/;
    if (!this.empNumber.match(empNumberPattern)) {
      this.isEmpNumberValid = false;
      this.empNumberError = 'Invalid faculty code format.';
      return false;
    }
    this.isEmpNumberValid = true;
    this.empNumberError = '';
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
    return !!this.empNumber && 
             !!this.sex && 
             !!this.firstName && 
             !!this.lastName && 
             !!this.department && 
             !!this.contact && 
             !!this.email;
  }

  onFieldInput(field: string) {
    this.fieldErrors[field] = false;
  
    if (field === 'empNumber') {
      this.isEmpNumberValid = true;
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
    return this.empNumber.trim() !== '' &&
             this.sex.trim() !== '' &&
             this.firstName.trim() !== '' &&
             this.lastName.trim() !== '' &&
             this.department.trim() !== '' &&
             this.contact.trim() !== '' &&
             this.email.trim() !== '';
  }

  onSubmit() {
    this.isEmpNumberValid = true;
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

    if (!this.validateEmpNumber()) {
      formIsValid = false;
    }

    if (!this.validateContact()) {
      formIsValid = false;
    }

    if (!this.validateEmail()) {
      formIsValid = false;
    }

    this.checkIfUserExistsAndContact(this.empNumber, this.contact);
  }

  checkIfUserExistsAndContact(empNumber: string, contact: string) {
    const identifierCheck = this.registerService
      .checkUserExists('faculty', empNumber, '').toPromise();
    const contactCheck = this.registerService
      .checkUserExists('faculty', '', contact).toPromise();

    Promise.all([identifierCheck, contactCheck])
      .then((results) => {
        const [identifierResponse, contactResponse] = results;

        this.isUserExists = false;
        this.isContactExists = false;

        if (identifierResponse.registered) {
          if (identifierResponse.message.includes('identifier')) {
            this.isUserExists = true;
            this.userExistsError = 'Faculty code is already registered.';
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
          !this.isEmpNumberValid || 
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
      empNumber: this.empNumber,
      sex: this.sex,
      firstName: this.firstName,
      lastName: this.lastName,
      department: this.department,
      contact: this.contact,
      email: this.email,
    };

    this.registerService.registerUser(formData).subscribe((response) => {
      if (response.status === 'success') {
        this.closeConfirmationModal();
        this.snackbar.showMessage('Faculty added successfully!');

        setTimeout(() => {
          this.goBack();
        }, 1000);
      }
    });
  }

  getDepartmentName(departmentId: string): string {
    const department = this.departments.find((d) => d.id === departmentId);
    return department ? department.dept_abbreviation : '';
  }

  goBack(): void {
    this.location.back();
  }
}