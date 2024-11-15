import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TimeLogService } from '../../../services/time-log.service';
import { SnackbarComponent } from '../../admin/snackbar/snackbar.component';
import { fail } from 'assert';

@Component({
  selector: 'app-time-out',
  templateUrl: './time-out.component.html',
  styleUrl: './time-out.component.css'
})
export class TimeOutComponent {
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;

  identifier: string = '';
  isProcessing: boolean = false;

  constructor(private timeLogService: TimeLogService, private router: Router) {}

  onSubmit() {
    this.timeLogService.checkTimeIn(this.identifier).subscribe(response => {
      if (response.timein) {
        this.isProcessing = true;
        this.timeLogService.logTimeOut(response.user_id).subscribe(() => {
          this.snackbar.showMessage('Timed-out successfully!');
            
          this.identifier = '';
              
          setTimeout(() => {
          }, 500);
          this.isProcessing = false;
        });
      } else {
        this.router.navigate(['/no-timein']);
      }
    });
  }
}