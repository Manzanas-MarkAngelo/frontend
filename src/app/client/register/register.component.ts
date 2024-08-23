import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../../../services/register.service';
import { CourseService } from '../../../services/course.service';
import { DepartmentService } from '../../../services/department.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
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
  course: string = '';
  contact: string = '';
  identifier: string = '';

  courses: any[] = [];
  departments: any[] = [];

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
    this.courseService.getCourses().subscribe(data => {
      this.courses = data;
    });
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe(data => {
      this.departments = data;
    });
  }

  onSubmit() {
    const formData: any = {
      selectedRole: this.selectedRole,
      sex: this.sex,
      firstName: this.firstName,
      lastName: this.lastName,
      department: this.department,
      school: this.school,
      course: this.course,
      contact: this.contact,
    };

    if (this.selectedRole === 'student') {
      formData.studentNumber = this.studentNumber;
    } else if (this.selectedRole === 'faculty') {
      formData.empNumber = this.empNumber;
    } else if (this.selectedRole === 'visitor') {
      formData.identifier = this.identifier;
    }

    this.registerService.registerUser(formData).subscribe(response => {
      if(response.status === 'success') {
        this.router.navigate(['/register-success']);
      }
    });
  }
}