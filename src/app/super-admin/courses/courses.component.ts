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
  showModal: boolean = false;
  selectedCourse: any;
  private previousPage: string | null = null;
  courseData: any = { course_program: '', course_abbreviation: '' };
  courseCount: number = 0;

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

    this.loadCourses();
  }

  goBack(): void {
    this.location.back();
  }

  addCourse(): void {
    this.courseService.addCourse(this.courseData).subscribe(response => {
      if (response.success) {
        this.snackbar.showMessage('Program added successfully');
        this.loadCourses();
      } else {
        this.snackbar.showMessage('Failed to add Program');
      }
    });
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe(data => {
      this.courses = data;
      this.courseCount = this.courses.length;
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
          this.loadCourses();
        } else {
          console.error('Error deleting course:', response.message);
        }
        this.closeDeleteModal();
      });
    }
  }
}