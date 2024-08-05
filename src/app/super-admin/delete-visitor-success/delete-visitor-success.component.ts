import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-visitor-success',
  templateUrl: './delete-visitor-success.component.html',
  styleUrls: ['./delete-visitor-success.component.css']
})
export class DeleteVisitorSuccessComponent {
  constructor(private router: Router) {}

  continue() {
    this.router.navigate(['/visitor']);
  }
}