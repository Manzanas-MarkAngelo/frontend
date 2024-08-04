import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-faculty-success',
  templateUrl: './add-faculty-success.component.html',
  styleUrls: ['./add-faculty-success.component.css']
})
export class AddFacultySuccessComponent {
  constructor(private router: Router) {}

  continue() {
    this.router.navigate(['/faculty']);
  }
}