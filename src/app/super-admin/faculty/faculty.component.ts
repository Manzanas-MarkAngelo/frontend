import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecordsService } from '../../../services/records.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { Subject, debounceTime } from 'rxjs';

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
  itemsPerPageOptions: number[] = [10, 25, 50, 100, 500, 1000];
  showModal: boolean = false;
  snackBarVisible: boolean = false;
  snackBarMessage: string = '';
  selectedUserId: number | null = null;
  selectedFacultyName: string = '';
  searchTerm: string = '';
  searchSubject: Subject<string> = new Subject<string>();

  constructor(
    private recordsService: RecordsService,
    private router: Router,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.fetchRecords();

    // Set up search debounce
    this.searchSubject.pipe(debounceTime(300)).subscribe(term => {
      this.searchTerm = term;
      this.fetchRecords();
    });
  }

  fetchRecords() {
    this.recordsService.getRecords('faculty', this.itemsPerPage, this.currentPage, this.searchTerm).subscribe(
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
    this.selectedFacultyName = name;
    this.selectedUserId = user_id;
    this.showModal = true;
  }

  hideModal() {
    this.showModal = false;
    this.selectedUserId = null;
  }

  deleteFaculty() {
    if (this.selectedUserId !== null) {
      this.recordsService.deleteFaculty(this.selectedUserId).subscribe(
        () => {
          this.showModal = false;
          this.fetchRecords();
          this.snackbarService.showSnackbar('Faculty deleted successfully');
        },
        error => {
          console.error('Error deleting faculty:', error);
          this.snackbarService.showSnackbar('Failed to delete faculty');
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
    this.fetchRecords();
  }
  
  clearLogType() {
    this.searchTerm = ''; // Clear the search term
    this.fetchRecords();
  }
}
