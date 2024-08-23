import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../../../services/register.service';
import { DepartmentService } from '../../../services/department.service';

@Component({
  selector: 'app-add-faculty',
  templateUrl: './add-faculty.component.html',
  styleUrls: ['./add-faculty.component.css']
})
export class AddFacultyComponent implements OnInit {
  selectedRole: string = 'faculty';
  empNumber: string = '';
  sex: string = '';
  firstName: string = '';
  lastName: string = '';
  department: string = '';
  contact: string = '';
  identifier: string = '';
  showModal: boolean = false;
  departments: any[] = [];

  constructor(
    private registerService: RegisterService, 
    private router: Router,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments() {
    this.departmentService.getDepartments().subscribe(data => {
      this.departments = data;
    }, error => {
      console.error('Error fetching departments:', error);
    });
  }

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
      department: this.department,
      contact: this.contact,
      empNumber: this.empNumber,
      identifier: this.identifier
    };

    this.registerService.registerUser(formData).subscribe(response => {
      console.log('Response from server:', response);
      if(response.status === 'success') {
        this.router.navigate(['/add-faculty-success']);
      } else {
        // Handle error here
      }
    });
  }

  cancelEdit() {
    this.router.navigate(['/faculty']);
  }
}