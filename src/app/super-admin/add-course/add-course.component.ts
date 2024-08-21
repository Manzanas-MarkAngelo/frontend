import { Component } from '@angular/core';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrl: './add-course.component.css'
})
export class AddCourseComponent {

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
