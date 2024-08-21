import { Component } from '@angular/core';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrl: './add-department.component.css'
})
export class AddDepartmentComponent {

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
