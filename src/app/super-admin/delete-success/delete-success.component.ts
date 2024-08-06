import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-success',
  templateUrl: './delete-success.component.html',
  styleUrls: ['./delete-success.component.css']
})
export class DeleteSuccessComponent {
  constructor(private router: Router) {}

  continue() {
    this.router.navigate(['/faculty']);
  }
}