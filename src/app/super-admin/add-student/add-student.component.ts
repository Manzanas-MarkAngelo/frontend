import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../../../services/register.service';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrl: './add-student.component.css'
})
export class AddStudentComponent {
  selectedRole: string = 'student';
  studentNumber: string = '';
  empNumber: string = '';
  sex: string = '';
  firstName: string = '';
  lastName: string = '';
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
        this.router.navigate(['/edit-success']);
      } else {
        // TODO: Handle error here
      }
    });
  }
}
