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
  sex: string = '';
  firstName: string = '';
  lastName: string = '';
  department: string = '';
  school: string = '';
  courseId: string = '';
  contact: string = '';
  identifier: string = '';

  courses: any[] = [];
  departments: any[] = [];

  isStudentNumberValid: boolean = true;
  studentNumberError: string = '';

  isEmpNumberValid: boolean = true;
  empNumberError: string = '';

  isUserExists: boolean = false;
  userExistsError: string = '';

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
    const studentNumberPattern = /^\d{4}-\d{5}-TG-0/;
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

  checkIfUserExists(role: string, identifier: string) {
    this.registerService.checkUserExists(role, identifier).subscribe(
      (response) => {
        if (response.registered) {
          this.isUserExists = true;
          this.userExistsError =
            role === 'student'
              ? 'Student number is already registered.'
              : 'Faculty code is already registered.';
        } else {
          this.isUserExists = false;
          this.onSubmitForm();
        }
      },
      (error) => {
        console.error('Error checking user:', error);
        this.isUserExists = false;
      }
    );
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

  onSubmit() {
    if (this.selectedRole === 'student') {
      if (this.validateStudentNumber()) {
        this.checkIfUserExists('student', this.studentNumber);
      }
    } else if (this.selectedRole === 'faculty') {
      if (this.validateEmpNumber()) {
        this.checkIfUserExists('faculty', this.empNumber);
      }
    } else {
      this.onSubmitForm();
    }
  }  
}