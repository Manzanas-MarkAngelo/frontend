import { Component } from '@angular/core';

@Component({
  selector: 'app-add-department-success',
  templateUrl: './add-department-success.component.html',
  styleUrl: './add-department-success.component.css'
})
export class AddDepartmentSuccessComponent {
  showModal = false; 

  openConfirmModal() {
    this.showModal = true;
    console.log('Modal opened');
  }

  closeConfirmModal() {
    this.showModal = false;
    console.log('Modal closed');
  }
}
