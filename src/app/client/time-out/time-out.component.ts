import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TimeLogService } from '../../../services/time-log.service';

@Component({
  selector: 'app-time-out',
  templateUrl: './time-out.component.html',
  styleUrl: './time-out.component.css'
})
export class TimeOutComponent {
  identifier: string = '';

  constructor(private timeLogService: TimeLogService, private router: Router) {}

  onSubmit() {
    this.timeLogService.checkTimeIn(this.identifier).subscribe(response => {
      if (response.timein) {
        this.timeLogService.logTimeOut(response.user_id).subscribe(() => {
          this.router.navigate(['/timeout-success']);
        });
      } else {
        this.router.navigate(['/no-timein']);
      }
    });
  }
}