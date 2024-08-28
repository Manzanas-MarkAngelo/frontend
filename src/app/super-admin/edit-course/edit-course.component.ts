import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent implements OnInit {
  showModal = false;
  courseId: number;
  courseData: any = { course_program: '', course_abbreviation: '' };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService
  ) {
    this.courseId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.getCourseDetails();
  }

  getCourseDetails(): void {
    this.courseService.getCourseById(this.courseId).subscribe(data => {
      this.courseData = data;
    });
  }

  openConfirmModal(): void {
    this.showModal = true;
  }

  closeConfirmModal(): void {
    this.showModal = false;
  }

  goBackToCourses() {
    this.router.navigate(['/courses']);
  }

  saveChanges(): void {
    this.courseService.updateCourse(this.courseId, this.courseData).subscribe(response => {
      if (response.success) {
        this.router.navigate(['/edit-success']);
      } else {
        console.error('Error updating course:', response.message);
      }
    });
  }
}