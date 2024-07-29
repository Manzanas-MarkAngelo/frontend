import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TimeLogService } from '../../../services/time-log.service';

@Component({
  selector: 'app-time-in',
  templateUrl: './time-in.component.html',
  styleUrl: './time-in.component.css'
})
export class TimeInComponent {
  selectedRole: string = 'Student';
  placeholderText: string = 'Enter your Student number here';
  identifier: string = '';

  constructor(private timeLogService: TimeLogService, private router: Router) { }

  updatePlaceholder() {
    if (this.selectedRole === 'Faculty') {
      this.placeholderText = 'Enter your Faculty number here';
    } else if (this.selectedRole === 'Visitor') {
      this.placeholderText = 'Enter your identifier here';
    } else {
      this.placeholderText = 'Enter your Student number here';
    }
  }

  onSubmit() {
    this.timeLogService.checkUser(this.selectedRole, this.identifier).subscribe(response => {
      if (response.registered) {
        this.timeLogService.logTimeIn(response.user_id).subscribe(() => {
          this.router.navigate(['/timein-success']);
        });
      } else {
        this.router.navigate(['/unregistered']);
      }
    });
  }
}