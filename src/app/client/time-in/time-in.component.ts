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
  isSubmitting: boolean = false;  // Flag to prevent double submission

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
  if (this.isSubmitting) return;  // Prevent double submission
     this.isSubmitting = true;  // Set flag to true before submitting
    
     this.timeLogService.checkUser(this.selectedRole, this.identifier).subscribe({
       next: (response) => {
         if (response.registered) {
           if (response.already_timed_in) {
             this.router.navigate(['/timein-already']);
           } else {
             this.timeLogService.logTimeIn(response.user_id).subscribe(() => {
               this.router.navigate(['/timein-success']);
               this.isSubmitting = false;  // Reset flag after success
             }, () => {
               this.isSubmitting = false;  // Reset flag if error occurs
             });
           }
         } else {
           this.router.navigate(['/unregistered']);
           this.isSubmitting = false;  // Reset flag after navigation
         }
       },
       error: () => {
         this.isSubmitting = false;  // Reset flag on error
       }
     });
   }
}
