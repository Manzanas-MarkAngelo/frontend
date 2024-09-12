import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecordsService } from '../../../services/records.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-faculty',
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.css']
})
export class FacultyComponent implements OnInit {
  searchPlaceholder: string = 'Search faculty';
  logs: any[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  itemsPerPage: number = 10;
  snackBarVisible: boolean = false;
  snackBarMessage: string = '';
  showModal: boolean = false;
  selectedUserId: number | null = null;
  slectedFacultyName: string = '';

  constructor(private recordsService: RecordsService, 
              private router: Router,
              private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.fetchRecords();
  }

  fetchRecords() {
    this.recordsService.getRecords('faculty', this.itemsPerPage, this.currentPage).subscribe(data => {
      this.logs = data.records;
      this.totalPages = data.totalPages;
    }, error => {
      console.error('Error fetching records:', error);
    });
  }

  openDeleteModal(user_id: number, name: string) {
    this.slectedFacultyName = name;
    this.selectedUserId = user_id;
    this.showModal = true;
  }

  hideModal() {
    this.showModal = false;
    this.selectedUserId = null;
  }

  deleteFaculty() {
    if (this.selectedUserId !== null) {
      this.recordsService.deleteFaculty(this.selectedUserId).subscribe(() => {
        this.showModal = false;
        this.fetchRecords();
        this.snackbarService.showSnackbar('Faculty deleted successfully');
      }, error => {
        console.error('Error deleting faculty:', error);
        this.snackbarService.showSnackbar('Failed to delete faculty');
      });
    }
  }

  clearSearch(): void {
    this.currentPage = 1; 
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchRecords();
  }
}