import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../services/course.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: any[] = [];
  showModal: boolean = false;
  selectedCourse: any;

  constructor(
    private courseService: CourseService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe(data => {
      this.courses = data;
    });
  }

  openDeleteModal(course: any): void {
    this.selectedCourse = course;
    this.showModal = true;
  }

  closeDeleteModal(): void {
    this.showModal = false;
  }

  deleteCourse(): void {
    if (this.selectedCourse) {
      this.courseService.deleteCourse(this.selectedCourse.id).subscribe(response => {
        if (response.success) {
          this.snackbarService.showSnackbar(`${this.selectedCourse.course_program} has been deleted.`);
          this.loadCourses(); // Reload the courses after deletion
        } else {
          console.error('Error deleting course:', response.message);
        }
        this.closeDeleteModal();
      });
    }
  }
}