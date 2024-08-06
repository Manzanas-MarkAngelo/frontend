import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-faculty-success',
  templateUrl: './edit-faculty-success.component.html',
  styleUrl: './edit-faculty-success.component.css'
})
export class EditFacultySuccessComponent {
  constructor(private router: Router) {}

  continue() {
    this.router.navigate(['/faculty']);
  }
}
