import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecordsService } from '../../../services/records.service';

@Component({
  selector: 'app-edit-faculty',
  templateUrl: './edit-faculty.component.html',
  styleUrls: ['./edit-faculty.component.css']
})
export class EditFacultyComponent implements OnInit {
  faculty: any = {};
  showModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recordsService: RecordsService
  ) {}

  ngOnInit(): void {
    const user_id = this.route.snapshot.paramMap.get('user_id');
    if (user_id) {
      this.recordsService.getRecordById('faculty', user_id).subscribe(data => {
        if (data && !data.error) {
          this.faculty = data;
        } else {
          console.error('No record found or error in fetching data', data.error);
        }
      }, error => {
        console.error('Error fetching faculty details:', error);
      });
    }
  }

  confirmEdit() {
    this.showModal = true;
  }

  hideModal() {
    this.showModal = false;
  }

  continueEdit() {
    this.recordsService.updateFaculty(this.faculty).subscribe(() => {
      this.router.navigate(['/edit-faculty-success']);
    }, error => {
      console.error('Error updating faculty:', error);
    });
  }

  cancelEdit() {
    this.router.navigate(['/faculty']);
  }
}