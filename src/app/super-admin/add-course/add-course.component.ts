import { Component } from '@angular/core';
import { CourseService } from '../../../services/course.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent {
  showModal = false;
  courseData: any = { course_program: '', course_abbreviation: '' };

  constructor(private courseService: CourseService, private router: Router) {}

  openConfirmModal(): void {
    this.showModal = true;
    console.log('Modal opened');
  }

  closeConfirmModal(): void {
    this.showModal = false;
    console.log('Modal closed');
  }

  addCourse(): void {
    this.courseService.addCourse(this.courseData).subscribe(response => {
      if (response.success) {
        this.router.navigate(['/add-successful']);
      } else {
        console.error('Error adding course:', response.message);
      }
    });
  }

  isFormValid(): boolean {
    return this.courseData.course_program.trim() !== '' && this.courseData.course_abbreviation.trim() !== '';
  }
}