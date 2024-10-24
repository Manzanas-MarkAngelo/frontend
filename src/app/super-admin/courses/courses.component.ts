import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../services/course.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: any[] = [];
  showModal: boolean = false;
  selectedCourse: any;
  private previousPage: string | null = null; // Store the previous page based on query param

  constructor(
    private courseService: CourseService,
    private snackbarService: SnackbarService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Get the query parameter 'from'
    this.route.queryParams.subscribe(params => {
      this.previousPage = params['from'] || null; // Store the previous page if it exists
      console.log('Came from:', this.previousPage);
    });

    this.loadCourses();
  }

  goBack(): void {
    this.location.back();
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
