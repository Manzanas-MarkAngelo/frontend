import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../../../services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  selectedRole: string = 'student';
  studentNumber: string = '';
  empNumber: string = '';
  sex: string = '';
  firstName: string = '';
  lastName: string = '';
  department: string = '';
  school: string = '';
  course: string = '';
  contact: string = '';
  identifier: string = '';

  constructor(private registerService: RegisterService, 
    private router: Router) {}

  onSubmit() {
    const formData: any = {
      selectedRole: this.selectedRole,
      sex: this.sex,
      firstName: this.firstName,
      lastName: this.lastName,
      department: this.department,
      school: this.school,
      course: this.course,
      contact: this.contact,
    };

    if (this.selectedRole === 'student') {
      formData.studentNumber = this.studentNumber;
    } else if (this.selectedRole === 'faculty') {
      formData.empNumber = this.empNumber;
    } else if (this.selectedRole === 'visitor') {
      formData.identifier = this.identifier;
    }

    this.registerService.registerUser(formData).subscribe(response => {
      console.log('Response from server:', response);
      if(response.status === 'success') {
        this.router.navigate(['/register-success']);
      } else {
        // TODO: Handle error here
      }
    });
  }
}