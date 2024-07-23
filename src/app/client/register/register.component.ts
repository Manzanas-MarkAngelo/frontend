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
  empNumber: string = ''; // Added empNumber
  sex: string = '';
  firstName: string = '';
  lastName: string = '';
  middleName: string = ''; // Added middleName
  department: string = '';
  school: string = '';
  course: string = '';
  contact: string = '';

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
      formData.middleName = this.middleName;
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
