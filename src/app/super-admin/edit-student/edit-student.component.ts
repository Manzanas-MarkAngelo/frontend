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

          this.courseService.getCourses().subscribe(coursesData => {
            this.courses = coursesData;

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
    const payload = {
      user_id: this.userId,
      student_number: this.student.student_number,
      gender: this.student.gender,
      first_name: this.student.first_name,
      surname: this.student.surname,
      course_id: this.student.course_id,
      phone_number: this.student.phone_number
    };
  
    console.log('Submitting student data:', payload);
  
    this.recordsService.updateStudent(payload).subscribe(
      response => {
        console.log('Update response:', response);
        if (response.status === 'success') {
          this.router.navigate(['/edit-success']);
        } else {
          console.error('Update failed:', response.message || response);
        }
      },
      error => {
        console.error('Request failed:', error.message);
      }
    );
  }
}