import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecordsService } from '../../../services/records.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit {
  student: any = {};
  showModal: boolean = false;
  userId: string | null = null;
  courses: any[] = [];

  constructor(
    private route: ActivatedRoute, 
    private recordsService: RecordsService, 
    private router: Router,
    private location: Location,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('user_id');
    if (this.userId) {
      this.recordsService.getStudentDetails(this.userId).subscribe(data => {
        if (data && !data.error) {
          this.student = data;

          // Ensure the courses are loaded before mapping
          this.courseService.getCourses().subscribe(coursesData => {
            this.courses = coursesData;

            // Find the course ID based on the course abbreviation or name
            const course = this.courses.find(c => c.course_abbreviation === this.student.course);
            if (course) {
              this.student.course_id = course.id;
            }

          }, error => {
            console.error('Error fetching courses:', error);
          });

        } else {
          console.error('No record found or error in fetching data', data.error);
        }
      }, error => {
        console.error('Error fetching student details:', error);
      });
    }
  }

  goBack(): void {
    this.location.back();
  }

  showConfirmModal(): void {
    this.showModal = true;
  }

  closeConfirmModal(): void {
    this.showModal = false;
  }

  saveChanges(): void {
    this.recordsService.updateStudent(this.student).subscribe(
      response => {
        if (response.status === 'success') {
          this.router.navigate(['/edit-success']);
        } else {
          console.log('Update failed', response.message);
        }
      },
      error => {
        console.error('Request failed', error);
      }
    );
  }
}