import { Component, OnInit, ViewChild } from '@angular/core';
import { BookRequestService } from '../../../services/book-request.service';
import { AnalyticsService } from '../../../services/analytics.service';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { subscribe } from 'diagnostics_channel';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrl: './request.component.css'
})
export class RequestComponent implements OnInit {
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;

  requests: any[] = [];
  paginatedRequests: any[] = [];
  itemsPerPage: number = 10;
  itemsPerPageOptions: number[] = [10, 25, 50, 100, 500, 1000];
  currentPage: number = 1;
  totalPages: number = 1;
  analyticsData: any = {}
  showConfirmationModal: boolean = false;
  selectedRequest: any;

  constructor(
    private bookRequestService: BookRequestService, 
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.loadRequests();
    this.loadAnalytics();
  }

  onItemsPerPageChange(event: any) {
    this.itemsPerPage = event.target.value;
    this.currentPage = 1;
    this.loadRequests();
  }

  loadRequests() {
    this.bookRequestService.fetchRequests().subscribe((response) => {
      if (response.success) {
        this.requests = response.requests;
        this.totalPages = Math.ceil(this.requests.length / this.itemsPerPage);
        this.updatePaginatedRequests();
      } else {
        console.error(response.message);
      }
    });
  }

  updatePaginatedRequests() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedRequests = this.requests.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedRequests();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedRequests();
    }
  }

  loadAnalytics() {
    this.analyticsService.getAnalyticsData().subscribe(
      (data) => {
        this.analyticsData = data;
      },
      (error) => {
        console.error('Error fetching analytics data', error)
      }
    );
  }

  openConfirmationModal(request: any) {
    this.selectedRequest = request;
    this.showConfirmationModal = true;
  }

  closeConfirmationModal() {
    this.showConfirmationModal = false;
  }

  confirmDelete() {
    if (this.selectedRequest) {
      this.bookRequestService.deleteRequest(this.selectedRequest.id).subscribe(
        (response) => {
          if (response.success) {
            this.snackbar.showMessage('Request deleted successfully');
            this.loadRequests();
          } else {
            console.error('Failed to delete request:', response.message || 'No specific error message');
          }
        },
        (error) => {
          console.error('Error deleting request:', error);
        }
      );
      this.closeConfirmationModal();
    }
  }  
}