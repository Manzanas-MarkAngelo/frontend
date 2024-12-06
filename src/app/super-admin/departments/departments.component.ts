import { Component, OnInit, ViewChild } from '@angular/core';
import { DepartmentService } from '../../../services/department.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { Location } from '@angular/common';
import { SnackbarComponent } from '../../admin/snackbar/snackbar.component';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;

  departments: any[] = [];
  showModal: boolean = false;
  selectedDepartment: any;
  departmentData = { dept_program: '', dept_abbreviation: '' };
  snackBarVisible: boolean = true;
  snackBarMessage: string = '';
  departmentCount: number = 0;

  constructor(
    private departmentService: DepartmentService,
    private snackbarService: SnackbarService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  goBack() {
    this.location.back();
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe(data => {
      this.departments = data;
      this.departmentCount = this.departments.length;
    });
  }
  

  openConfirmModal(department: any): void {
    this.selectedDepartment = department;
    this.showModal = true;
  }

  closeConfirmModal(): void {
    this.showModal = false;
  }

  // Function to handle the form submission
  addDepartment(): void {
    this.departmentService.addDepartment(this.departmentData).subscribe(response => {
      if (response.success) {
        this.snackbar.showMessage('Department added successfully');
        this.loadDepartments(); // Reload departments after adding
        this.departmentData = { dept_program: '', dept_abbreviation: '' }; // Reset form
      } else {
        this.snackbar.showMessage('Failed to add Department');
      }
    });
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