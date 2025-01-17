import { Component, OnInit, ViewChild } from '@angular/core';
import { CourseService } from '../../../services/course.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SnackbarComponent } from '../../admin/snackbar/snackbar.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;
  courses: any[] = [];
  showDeleteModal: boolean = false;
  selectedCourse: any;
  private previousPage: string | null = null;
  courseData: any = { course_program: '', course_abbreviation: '' };
  courseCount: number = 0;
  showModal = false;

  constructor(
    private courseService: CourseService,
    private snackbarService: SnackbarService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.previousPage = params['from'] || null;
    });

    this.loadCourses(); // Load the first page of courses
  }

  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;

  goBack(): void {
    this.location.back();
  }

  openConfirmModal(): void {
    this.showModal = true;
  }

  closeConfirmModal(): void {
    this.showModal = false;
  }

  addCourse(): void {
    this.courseService.addCourse(this.courseData).subscribe(response => {
      if (response.success) {
        this.showModal = false;
        this.snackbar.showMessage('Program added successfully');
        this.loadCourses();
        this.courseData = { course_program: '', course_abbreviation: '' };
      } else {
        this.snackbar.showMessage('Failed to add Program');
      }
    });
  }

  isFormValid(): boolean {
    return this.courseData.course_program.trim() !== '' && this.courseData.course_abbreviation.trim() !== '';
  }

  loadCourses(): void {
    this.courseService.getPaginatedCourses(this.currentPage, this.pageSize).subscribe(response => {
      this.courses = response.courses;
      this.totalPages = response.totalPages;
      this.courseCount = response.totalCourses;
    });
    console.log(this.courses);
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return; // Prevent invalid page numbers
    this.currentPage = page;
    this.loadCourses(); // Fetch new data based on the current page
  }

  openDeleteModal(course: any): void {
    this.selectedCourse = course;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  deleteCourse(): void {
    if (this.selectedCourse) {
      this.courseService.deleteCourse(this.selectedCourse.id).subscribe(response => {
        if (response.success) {
          this.snackbarService.showSnackbar(`${this.selectedCourse.course_program} has been deleted.`);
          this.loadCourses(); // Reload courses after deletion
        } else {
          console.error('Error deleting course:', response.message);
        }
        this.closeDeleteModal();
      });
    }
  }
}
