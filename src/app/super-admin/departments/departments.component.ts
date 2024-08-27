import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../../services/department.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {
  departments: any[] = [];
  showModal: boolean = false;
  selectedDepartment: any;

  constructor(
    private departmentService: DepartmentService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe(data => {
      this.departments = data;
    });
  }

  openConfirmModal(department: any): void {
    this.selectedDepartment = department;
    this.showModal = true;
  }

  closeConfirmModal(): void {
    this.showModal = false;
  }

  deleteDepartment(): void {
    this.departmentService.deleteDepartment(this.selectedDepartment.id).subscribe(response => {
      if (response.success) {
        this.snackbarService.showSnackbar(`Department ${this.selectedDepartment.dept_program} deleted successfully.`);
        this.loadDepartments();
      } else {
        console.error('Error deleting department:', response.message);
      }
      this.closeConfirmModal();
    });
  }
}