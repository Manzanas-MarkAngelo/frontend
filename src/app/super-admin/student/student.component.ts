import { Component, OnInit } from '@angular/core';
import { RecordsService } from '../../../services/records.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { Subject, debounceTime } from 'rxjs';
import { PageStateService } from '../../../services/page-state.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  logs: any[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  itemsPerPage: number = 10;
  itemsPerPageOptions: number[] = [10, 25, 50, 100, 500, 1000];
  showModal: boolean = false;
  snackBarVisible: boolean = false;
  snackBarMessage: string = '';
  selectedStudentId: number | null = null;
  selectedStudentName: string = '';
  searchTerm: string = '';
  searchSubject: Subject<string> = new Subject<string>();

  constructor(private recordsService: RecordsService, 
              private snackbarService: SnackbarService,
              private pageStateService: PageStateService,) {}

  ngOnInit(): void {
    this.currentPage = this.pageStateService.getMaterialCurrentPage('students');
    this.fetchRecords();
    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(term => {
      this.searchTerm = term;
      this.fetchRecords();
    });
  }

  fetchRecords() {
    this.recordsService.getRecords('student', this.itemsPerPage, this.currentPage, this.searchTerm).subscribe(data => {
      this.logs = data.records;
      this.totalPages = data.totalPages;
    }, error => {
      console.error('Error fetching records:', error);
    });
  }

  onItemsPerPageChange(event: any) {
    this.itemsPerPage = event.target.value;
    this.currentPage = 1;
    this.fetchRecords();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.pageStateService.setMaterialCurrentPage(page, 'students');
    this.fetchRecords();
  }

  showConfirmModal(userId: number, name: string): void {
    this.selectedStudentId = userId;
    this.selectedStudentName = name;
    this.showModal = true;
  }

  closeConfirmModal(): void {
    this.showModal = false;
    this.selectedStudentId = null;
  }

  deleteStudent(): void {
    if (this.selectedStudentId !== null) {
      this.recordsService.deleteStudent(this.selectedStudentId).subscribe(
        response => {
          this.snackbarService.showSnackbar('Student deleted successfully');
          this.fetchRecords();
        },
        error => {
          this.snackbarService.showSnackbar('Failed to delete student');
          console.error('Error deleting student:', error);
        }
      );
      this.closeConfirmModal();
    }
  }

  onSearchChange(searchTerm: string) {
    this.searchSubject.next(searchTerm);
  }

  clearLogType() {
    this.searchTerm = '';
    this.currentPage = 1;
    this.pageStateService.setMaterialCurrentPage(this.currentPage, 'students');
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