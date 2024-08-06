import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-visitor-success',
  templateUrl: './add-visitor-success.component.html',
  styleUrl: './add-visitor-success.component.css'
})
export class AddVisitorSuccessComponent {
  constructor(private router: Router) {}

  continue() {
    this.router.navigate(['/visitor']);
  }
}
