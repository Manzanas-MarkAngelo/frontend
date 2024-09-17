import { Component, OnInit } from '@angular/core';
import { BookRequestService } from '../../../services/book-request.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
})
export class AnalyticsComponent implements OnInit {
  requests: any[] = [];
  paginatedRequests: any[] = [];
  itemsPerPage: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private bookRequestService: BookRequestService) {}

  ngOnInit(): void {
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
}