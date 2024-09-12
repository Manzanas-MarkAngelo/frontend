import { Component, OnInit } from '@angular/core';
import { RecordsService } from '../../../services/records.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { Subject, debounceTime } from 'rxjs';

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
  showModal: boolean = false;
  snackBarVisible: boolean = false;
  snackBarMessage: string = '';
  selectedStudentId: number | null = null;
  selectedStudentName: string = '';
  searchTerm: string = '';
  searchSubject: Subject<string> = new Subject<string>();

  constructor(private recordsService: RecordsService, 
              private snackbarService: SnackbarService) {}

  ngOnInit(): void {
    this.fetchRecords();
    this.searchSubject.pipe(
      debounceTime(300)  // Adjust debounce time as needed
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

  onPageChange(page: number) {
    this.currentPage = page;
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
}
