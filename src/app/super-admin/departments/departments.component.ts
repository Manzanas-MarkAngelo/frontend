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
  showDeleteModal: boolean = false;
  selectedDepartment: any;
  departmentData = { dept_program: '', dept_abbreviation: '' };
  snackBarVisible: boolean = true;
  snackBarMessage: string = '';
  departmentCount: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  showModal = false;

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
    this.departmentService.getPaginatedDepartments(this.currentPage, this.pageSize).subscribe(data => {
      this.departments = data.departments;
      this.totalPages = data.totalPages;
      this.departmentCount = data.totalDepartments;
    });
  }

  onPageChange(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadDepartments();
    }
  }
  

  openConfirmDeleteModal(department: any): void {
    this.selectedDepartment = department;
    this.showDeleteModal = true;
  }

  closeConfirmDeleteModal(): void {
    this.showDeleteModal = false;
  }

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
        this.showModal = false;
        this.snackbar.showMessage('Department added successfully');
        this.loadDepartments();
        this.departmentData = { dept_program: '', dept_abbreviation: '' };
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
      this.closeConfirmDeleteModal();
    });
  }
}