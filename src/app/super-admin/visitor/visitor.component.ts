import { Component, OnInit } from '@angular/core';
import { RecordsService } from '../../../services/records.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-visitor',
  templateUrl: './visitor.component.html',
  styleUrls: ['./visitor.component.css']
})
export class VisitorComponent implements OnInit {
  searchPlaceholder: string = 'Search visitor';
  logs: any[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  itemsPerPage: number = 12;
  showModal: boolean = false;
  selectedVisitor: any = null;
  selectedVisitorName: string = '';
  searchTerm: string = '';
  searchSubject: Subject<string> = new Subject<string>();

  constructor(
    private recordsService: RecordsService, 
    private snackbarService: SnackbarService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchRecords();

    // Set up search with debounce
    this.searchSubject.pipe(debounceTime(300)).subscribe(term => {
      this.searchTerm = term;
      this.fetchRecords();
    });
  }

  fetchRecords() {
    this.recordsService.getRecords('visitor', this.itemsPerPage, this.currentPage, this.searchTerm).subscribe(
      data => {
        this.logs = data.records;
        this.totalPages = data.totalPages;
      },
      error => {
        console.error('Error fetching records:', error);
      }
    );
  }

  clearLogType() {
    this.searchTerm = ''; // Clear the search term
    this.fetchRecords();
  }

  onSearchChange(searchTerm: string) {
    this.searchSubject.next(searchTerm);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchRecords();
  }

  openDeleteModal(visitor: any, name: string) {
    this.selectedVisitor = visitor;
    this.selectedVisitorName = name;
    this.showModal = true;
  }

  hideModal() {
    this.showModal = false;
    this.selectedVisitor = null;
  }

  deleteVisitor() {
    if (this.selectedVisitor) {
      this.recordsService.deleteVisitor(this.selectedVisitor.user_id).subscribe(
        () => {
          this.showModal = false;
          this.selectedVisitor = null;
          this.snackbarService.showSnackbar('Visitor deleted successfully');
          this.fetchRecords();
        },
        error => {
          this.snackbarService.showSnackbar('Failed to delete visitor');
          console.error('Error deleting visitor:', error);
        }
      );
    }
  }
}
