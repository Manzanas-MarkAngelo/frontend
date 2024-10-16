import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../../../services/register.service';
import { Location } from '@angular/common';
import { CourseService } from '../../../services/course.service';
import { SnackbarComponent } from '../../admin/snackbar/snackbar.component';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;

  selectedRole: string = 'student';
  studentNumber: string = '';
  contact: string = '';
  sex: string = '';
  firstName: string = '';
  lastName: string = '';
  courseId: string = '';
  email: string = '';
  courses: any[] = [];

  isStudentNumberValid: boolean = true;
  studentNumberError: string = '';
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
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getCourses().subscribe(data => {
      this.courses = data;
    }, error => {
      console.error('Error fetching courses:', error);
    });
  }

  capitalizeFirstLetter(value: string): string {
    if (!value) return value;

    return value
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  validateStudentNumber(): boolean {
    const studentNumberPattern = /^\d{4}-\d{5}-TG-0$/;
    if (!this.studentNumber.match(studentNumberPattern)) {
      this.isStudentNumberValid = false;
      this.studentNumberError = 'Invalid student number format.';
      return false;
    }
    this.isStudentNumberValid = true;
    this.studentNumberError = '';
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
    return !!this.studentNumber && 
             !!this.sex && 
             !!this.firstName && 
             !!this.lastName && 
             !!this.courseId && 
             !!this.contact && 
             !!this.email;
  }

  onFieldInput(field: string) {
    this.fieldErrors[field] = false;
   
    if (field === 'studentNumber') {
      this.isStudentNumberValid = true;
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
    return this.studentNumber.trim() !== '' &&
             this.sex.trim() !== '' &&
             this.firstName.trim() !== '' &&
             this.lastName.trim() !== '' &&
             this.courseId.trim() !== '' &&
             this.contact.trim() !== '' &&
             this.email.trim() !== '';
  }

  onSubmit() {
    this.isStudentNumberValid = true;
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

    if (!this.validateStudentNumber()) {
      formIsValid = false;
    }

    if (!this.validateContact()) {
      formIsValid = false;
    }

    if (!this.validateEmail()) {
      formIsValid = false;
    }

    this.checkIfUserExistsAndContact(this.studentNumber, this.contact);
  }

  checkIfUserExistsAndContact(studentNumber: string, contact: string) {
    const identifierCheck = this.registerService
      .checkUserExists('student', studentNumber, '').toPromise();
    const contactCheck = this.registerService
      .checkUserExists('student', '', contact).toPromise();

    Promise.all([identifierCheck, contactCheck])
      .then((results) => {
        const [identifierResponse, contactResponse] = results;

        this.isUserExists = false;
        this.isContactExists = false;

        if (identifierResponse.registered) {
          if (identifierResponse.message.includes('identifier')) {
            this.isUserExists = true;
            this.userExistsError = 'Student number is already registered.';
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
          !this.isStudentNumberValid || 
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
      studentNumber: this.studentNumber,
      sex: this.sex,
      firstName: this.firstName,
      lastName: this.lastName,
      courseId: this.courseId,
      contact: this.contact,
      email: this.email,
    };

    this.registerService.registerUser(formData).subscribe((response) => {
      if (response.status === 'success') {
        this.closeConfirmationModal();
        this.snackbar.showMessage('Student added successfully!');

        setTimeout(() => {
          this.goBack();
        }, 3000);
      }
    });
  }

  getCourseName(courseId: string): string {
    const course = this.courses.find((c) => c.id === courseId);
    return course ? course.course_abbreviation : '';
  }

  goBack(): void {
    this.location.back();
  }
}