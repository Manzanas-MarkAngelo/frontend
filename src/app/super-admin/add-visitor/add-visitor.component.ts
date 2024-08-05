import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../../../services/register.service';

@Component({
  selector: 'app-add-visitor',
  templateUrl: './add-visitor.component.html',
  styleUrls: ['./add-visitor.component.css']
})
export class AddVisitorComponent {
  selectedRole: string = 'visitor';
  sex: string = '';
  firstName: string = '';
  lastName: string = '';
  school: string = '';
  contact: string = '';
  identifier: string = '';
  showModal: boolean = false;

  constructor(private registerService: RegisterService, private router: Router) {}

  openModal() {
    this.showModal = true;
  }

  hideModal() {
    this.showModal = false;
  }

  continueAdd() {
    this.showModal = false;
    this.onSubmit();
  }

  onSubmit() {
    const formData: any = {
      selectedRole: this.selectedRole,
      sex: this.sex,
      firstName: this.firstName,
      lastName: this.lastName,
      school: this.school,
      contact: this.contact,
      identifier: this.identifier
    };

    this.registerService.registerUser(formData).subscribe(response => {
      console.log('Response from server:', response);
      if(response.status === 'success') {
        this.router.navigate(['/add-visitor-success']);
      } else {
        // TODO: Handle error here
      }
    });
  }

  cancelEdit() {
    this.router.navigate(['/visitor']);
  }
}