import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../services/course.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';

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
    private router: Router
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
    console.log('GoBack called');
    
    // Navigate to the previous page if available
    if (this.previousPage) {
      console.log('Navigating back to:', this.previousPage);
      this.router.navigate([this.previousPage]); // Navigate to the previous page
    } else {
      console.log('No previous page found, navigating to /courses');
      this.router.navigate(['/courses']); // Fallback to the courses page
    }
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
