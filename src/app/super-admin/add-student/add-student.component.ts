import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../../../services/register.service';
import { Location } from '@angular/common';
import { CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {
  selectedRole: string = 'student';
  studentNumber: string = '';
  sex: string = '';
  firstName: string = '';
  lastName: string = '';
  courseId: string = '';
  contact: string = '';
  courses: any[] = [];

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

  onSubmit() {
    const formData: any = {
      selectedRole: this.selectedRole,
      sex: this.sex,
      firstName: this.firstName,
      lastName: this.lastName,
      courseId: this.courseId,
      contact: this.contact,
      studentNumber: this.studentNumber
    };

    this.registerService.registerUser(formData).subscribe(response => {
      console.log('Response from server:', response);
      if (response.status === 'success') {
        this.router.navigate(['/add-success']);
      } else {
        console.error('Error adding student:', response.message);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}