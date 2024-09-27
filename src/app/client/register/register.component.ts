import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../../../services/register.service';
import { CourseService } from '../../../services/course.service';
import { DepartmentService } from '../../../services/department.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  selectedRole: string = 'student';
  studentNumber: string = '';
  empNumber: string = '';
  contact: string = '';
  sex: string = '';
  firstName: string = '';
  lastName: string = '';
  department: string = '';
  school: string = '';
  courseId: string = '';
  identifier: string = '';
  courses: any[] = [];
  departments: any[] = [];

  isStudentNumberValid: boolean = true;
  studentNumberError: string = '';
  isEmpNumberValid: boolean = true;
  empNumberError: string = '';
  isUserExists: boolean = false;
  userExistsError: string = '';
  isContactValid: boolean = true;
  contactError: string = '';
  isContactExists: boolean = false;
  contactExistsError: string = '';
  hasFormErrors: boolean = false;

  constructor(
    private registerService: RegisterService,
    private courseService: CourseService,
    private departmentService: DepartmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCourses();
    this.loadDepartments();
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe((data) => {
      this.courses = data;
    });
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe((data) => {
      this.departments = data;
    });
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

  validateEmpNumber(): boolean {
    const empNumberPattern = /^FA\d{8}$/;
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

  onSubmit() {
    this.isStudentNumberValid = true;
    this.isEmpNumberValid = true;
    this.isContactValid = true;
    this.isUserExists = false;
    this.isContactExists = false;
    this.hasFormErrors = false;
  
    let formIsValid = true;
  
    if (!this.validateRequiredFields()) {
      this.hasFormErrors = true;
      return;
    }
  
    if (this.selectedRole === 'student') {
      if (!this.validateStudentNumber()) {
        formIsValid = false;
      }
    } else if (this.selectedRole === 'faculty') {
      if (!this.validateEmpNumber()) {
        formIsValid = false;
      }
    } else if (this.selectedRole === 'visitor') {
      if (!this.identifier) {
        this.isUserExists = true;
        this.userExistsError = 'Visitor identifier is required.';
        formIsValid = false;
      }
    }
  
    if (!this.validateContact()) {
      formIsValid = false;
    }
  
    this.checkIfUserExistsAndContact(
      this.selectedRole, 
      this.selectedRole === 'student' 
        ? this.studentNumber 
        : this.selectedRole === 'faculty' 
        ? this.empNumber 
        : this.identifier, this.contact
      );
  }
  
  checkIfUserExistsAndContact(role: string, identifier: string, contact: string) {
    const identifierCheck = this.registerService
      .checkUserExists(role, identifier, '').toPromise();
    const contactCheck = this.registerService
      .checkUserExists(role, '', contact).toPromise();
  
    Promise.all([identifierCheck, contactCheck])
      .then((results) => {
        const [identifierResponse, contactResponse] = results;
  
        this.isUserExists = false;
        this.isContactExists = false;
  
        if (identifierResponse.registered) {
          if (identifierResponse.message.includes('identifier')) {
            this.isUserExists = true;
            this.userExistsError =
              role === 'student'
                ? 'Student number is already registered.'
                : role === 'faculty'
                ? 'Faculty code is already registered.'
                : 'Visitor identifier is already registered.';
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
          !this.isEmpNumberValid || 
          !this.isContactValid
        ) {
          return;
        }
  
        this.onSubmitForm();
      })
      .catch((error) => {
        console.error('Error checking user or contact:', error);
        this.isUserExists = false;
        this.isContactExists = false;
      });
  }
  
  
  onSubmitForm() {
    const formData: any = {
      selectedRole: this.selectedRole,
      sex: this.sex,
      firstName: this.firstName,
      lastName: this.lastName,
      department: this.department,
      school: this.school,
      courseId: this.courseId,
      contact: this.contact,
    };

    if (this.selectedRole === 'student') {
      formData.studentNumber = this.studentNumber;
    } else if (this.selectedRole === 'faculty') {
      formData.empNumber = this.empNumber;
    } else if (this.selectedRole === 'visitor') {
      formData.identifier = this.identifier;
    }

    this.registerService.registerUser(formData).subscribe((response) => {
      if (response.status === 'success') {
        this.router.navigate(['/register-success']);
      }
    });
  }

  validateRequiredFields(): boolean {
    if (this.selectedRole === 'student') {
      return !!this.studentNumber && 
             !!this.sex && 
             !!this.firstName && 
             !!this.lastName && 
             !!this.courseId && 
             !!this.contact;
    } else if (this.selectedRole === 'faculty') {
      return !!this.empNumber && 
             !!this.sex && 
             !!this.firstName && 
             !!this.lastName && 
             !!this.department && 
             !!this.contact;
    } else if (this.selectedRole === 'visitor') {
      return !!this.school && 
             !!this.sex && 
             !!this.firstName && 
             !!this.lastName && 
             !!this.identifier && 
             !!this.contact;
    }
    return false;
  }

  openRequestModal() {
    (document.getElementById('my_modal_1') as HTMLDialogElement)
      .showModal();
  }

  closeRequestModal() {
    (document.getElementById('my_modal_1') as HTMLDialogElement)
      .close();
  }

}