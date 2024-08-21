import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-department',
  templateUrl: './edit-department.component.html',
  styleUrl: './edit-department.component.css'
})
export class EditDepartmentComponent {
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
