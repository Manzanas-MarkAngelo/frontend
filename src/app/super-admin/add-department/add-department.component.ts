import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DepartmentService } from '../../../services/department.service';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrl: './add-department.component.css'
})
export class AddDepartmentComponent {
  showModal = false;
  departmentData = { dept_program: '', dept_abbreviation: '' };

  constructor(
    private departmentService: DepartmentService,
    private router: Router
  ) {}

  openConfirmModal() {
    this.showModal = true;
  }

  closeConfirmModal() {
    this.showModal = false;
  }

  isFormValid(): boolean {
    return this.departmentData.dept_program !== '' && this.departmentData.dept_abbreviation !== '';
  }

  addDepartment(): void {
    this.departmentService.addDepartment(this.departmentData).subscribe(response => {
      if (response.success) {
        this.router.navigate(['/add-department-success']);
      } else {
        console.error('Error adding department:', response.message);
      }
    });
  }
}