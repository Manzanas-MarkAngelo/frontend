import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrl: './edit-course.component.css'
})
export class EditCourseComponent {
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
