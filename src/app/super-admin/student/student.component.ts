import { Component, OnInit } from '@angular/core';
import { RecordsService } from '../../../services/records.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  logs: any[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  itemsPerPage: number = 13;
  showModal: boolean = false;
  snackBarVisible: boolean = false;
  snackBarMessage: string = '';
  selectedStudentId: number | null = null;
  slectedStudentName: string ='';

  constructor(private recordsService: RecordsService) {}

  ngOnInit(): void {
    this.fetchRecords();
  }

  fetchRecords() {
    this.recordsService.getRecords('student', this.itemsPerPage, this.currentPage).subscribe(data => {
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
    this.slectedStudentName = name;
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
          console.log( this.selectedStudentId)
          this.snackBarMessage = 'Student deleted successfully';
          this.showSnackBar();
          this.fetchRecords();
        },
        error => {
          this.snackBarMessage = 'Failed to delete student';
          this.showSnackBar();
          console.error('Error deleting student:', error);
        }
      );
      this.closeConfirmModal();
    }
  }

  showSnackBar(): void {
    this.snackBarVisible = true;
    setTimeout(() => {
      this.snackBarVisible = false;
    }, 3000); // 3000ms = 3 seconds
  }

  closeSnackBar(): void {
    this.snackBarVisible = false;
  }
}
