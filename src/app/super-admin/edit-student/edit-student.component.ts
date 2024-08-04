import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecordsService } from '../../../services/records.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit {
  student: any = {};
  showModal: boolean = false;
  userId: string | null = null;

  constructor(
    private route: ActivatedRoute, 
    private recordsService: RecordsService, 
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('user_id');
    if (this.userId) {
      this.recordsService.getStudentDetails(this.userId).subscribe(data => {
        this.student = data;
        this.student.user_id = this.userId; // Add user_id to student object
        this.populateForm();
      });
    }
  }

  goBack(): void {
    this.location.back();
  }

  populateForm(): void {
    this.student.student_number = this.student.student_number || 'unknown/empty';
    this.student.gender = this.student.gender || 'unknown/empty';
    this.student.first_name = this.student.first_name || 'unknown/empty';
    this.student.surname = this.student.surname || 'unknown/empty';
    this.student.course = this.student.course || 'unknown/empty';
    this.student.phone_number = this.student.phone_number || 'unknown/empty';
  }

  showConfirmModal(): void {
    this.showModal = true;
  }

  closeConfirmModal(): void {
    this.showModal = false;
  }

  saveChanges(): void {
    // Log the student data before making the API call
    console.log('Student data being saved:', this.student);
  
    this.recordsService.updateStudent(this.student).subscribe(
      response => {
        if (response.status === 'success') {
          console.log('Update successful');
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
