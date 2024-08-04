import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RecordsService } from '../../../services/records.service';

@Component({
  selector: 'app-edit-warning',
  templateUrl: './edit-warning.component.html',
  styleUrls: ['./edit-warning.component.css']
})
export class EditWarningComponent implements OnInit {
  faculty: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recordsService: RecordsService
  ) {}

  ngOnInit(): void {
    this.faculty = JSON.parse(this.route.snapshot.paramMap.get('faculty') || '{}');
  }

  back() {
    this.router.navigate(['/edit-faculty', { user_id: this.faculty.user_id }]);
  }

  continue() {
    this.recordsService.updateFaculty(this.faculty).subscribe(() => {
      this.router.navigate(['/faculty']);
    }, error => {
      console.error('Error updating faculty:', error);
    });
  }
}