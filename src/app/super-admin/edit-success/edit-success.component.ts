import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-success',
  templateUrl: './edit-success.component.html',
  styleUrls: ['./edit-success.component.css']
})
export class EditSuccessComponent {
  constructor(private router: Router) {}

  continue() {
    this.router.navigate(['/faculty']);
  }
}