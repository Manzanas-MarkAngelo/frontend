import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TimeLogService } from '../../../services/time-log.service';
import { SnackbarComponent } from '../../admin/snackbar/snackbar.component';

@Component({
  selector: 'app-time-in',
  templateUrl: './time-in.component.html',
  styleUrl: './time-in.component.css'
})
export class TimeInComponent {
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;

  selectedRole: string = 'Student';
  placeholderText: string = 'Enter your Student number here';
  identifier: string = '';
  isSubmitting: boolean = false;

  constructor(private timeLogService: TimeLogService, private router: Router) { }

  updatePlaceholder() {
    if (this.selectedRole === 'Faculty') {
      this.placeholderText = 'Enter your Faculty code here';
    } else if (this.selectedRole === 'Visitor') {
      this.placeholderText = 'Enter your identifier here';
    } else if (this.selectedRole === 'PUPT-Employee') {
      this.placeholderText = 'Enter your Employee number here';
    } else {
      this.placeholderText = 'Enter your Student number here';
    }
  }

  onSubmit() {
  if (this.isSubmitting) return;
     this.isSubmitting = true;
    
     this.timeLogService.checkUser(this.selectedRole, this.identifier).subscribe({
       next: (response) => {
         if (response.registered) {
           if (response.already_timed_in) {
             this.router.navigate(['/timein-already']);
           } else {
             this.timeLogService.logTimeIn(response.user_id).subscribe(() => {
              this.snackbar.showMessage('Time-in successful!');
            
              this.identifier = '';
              
              setTimeout(() => {
                this.isSubmitting = false;
              }, 500);
            }, () => {
              this.isSubmitting = false;
            });
           }
         } else {
           this.router.navigate(['/unregistered']);
           this.isSubmitting = false;
         }
       },
       error: () => {
         this.isSubmitting = false;
       }
     });
   }
}