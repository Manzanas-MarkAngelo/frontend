import { Component, OnInit, ViewChild } from '@angular/core';
import { RecordsService } from '../../../services/records.service';
import { SnackbarComponent } from '../../admin/snackbar/snackbar.component';
import { Subject, debounceTime } from 'rxjs';
import { PageStateService } from '../../../services/page-state.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;

  searchPlaceholder: string = 'Search employee';
  logs: any[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  itemsPerPage: number = 10;
  itemsPerPageOptions: number[] = [10, 25, 50, 100, 500, 1000];
  showModal: boolean = false;
  selectedUserId: number | null = null;
  selectedEmployeeName: string = '';
  searchTerm: string = '';
  searchSubject: Subject<string> = new Subject<string>();

  constructor(private recordsService: RecordsService,
              private pageStateService: PageStateService
  ) {}

  ngOnInit(): void {
    this.currentPage = this.pageStateService.getMaterialCurrentPage('employee');
    this.fetchRecords();

    this.searchSubject.pipe(debounceTime(300)).subscribe(term => {
      this.searchTerm = term;
      this.fetchRecords();
    });
  }

  fetchRecords() {
    this.recordsService.getRecords('pupt-employee', this.itemsPerPage, this.currentPage, this.searchTerm).subscribe(
      data => {
        this.logs = data.records;
        this.totalPages = data.totalPages;
      },
      error => {
        console.error('Error fetching records:', error);
      }
    );
  }

  openDeleteModal(user_id: number, name: string) {
    this.selectedEmployeeName = name;
    this.selectedUserId = user_id;
    this.showModal = true;
  }

  hideModal() {
    this.showModal = false;
    this.selectedUserId = null;
  }

  deleteEmployee() {
    if (this.selectedUserId !== null) {
      this.recordsService.deleteEmployee(this.selectedUserId).subscribe(
        () => {
          this.showModal = false;
          this.fetchRecords();
          this.snackbar.showMessage('Employee deleted successfully.');
        },
        error => {
          console.error('Error deleting employee:', error);
          this.snackbar.showMessage('Failed to delete employee');
        }
      );
    }
  }

  onSearchChange(searchTerm: string) {
    this.searchSubject.next(searchTerm);
  }

  onItemsPerPageChange(event: any) {
    this.itemsPerPage = event.target.value;
    this.currentPage = 1;
    this.fetchRecords();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.pageStateService.setMaterialCurrentPage(page, 'employee');
    this.fetchRecords();
  }

  clearLogType() {
    this.searchTerm = '';
    this.currentPage = 1;
    this.pageStateService.setMaterialCurrentPage(this.currentPage, 'employee');
    this.fetchRecords();
  }

  capitalize(value: string): string {
    if (!value) return value;
    return value
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}