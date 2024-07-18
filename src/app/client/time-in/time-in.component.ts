import { Component } from '@angular/core';

@Component({
  selector: 'app-time-in',
  templateUrl: './time-in.component.html',
  styleUrl: './time-in.component.css'
})
export class TimeInComponent {
  selectedRole: string = '';
  placeholderText: string = 'Enter your Student number here';

  updatePlaceholder() {
    if (this.selectedRole === 'Faculty') {
      this.placeholderText = 'Enter your Faculty number here';
    } else if (this.selectedRole === 'Visitor') {
      this.placeholderText = 'Enter your Visitor number here';
    } 
    else {
      this.placeholderText = 'Enter your Student number here';
    }
  }
}
