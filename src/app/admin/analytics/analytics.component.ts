import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { BookRequestService } from '../../../services/book-request.service';
import { AnalyticsService } from '../../../services/analytics.service';
import { timer, interval } from 'rxjs';
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
})
export class AnalyticsComponent implements OnInit, AfterViewInit {
  requests: any[] = [];
  paginatedRequests: any[] = [];
  itemsPerPage: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;
  isInitialLoad: boolean = true;

  analyticsData: any = {};
  previousAnalyticsData: any = {};
  updatedCards: Set<string> = new Set();

  totalEmployee: any;
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  public scrollDirection: 'right' | 'left' = 'right';

  constructor(
    private bookRequestService: BookRequestService, 
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.loadRequests();
    this.loadAnalytics();

  // Use RxJS timer for the first call, then interval for subsequent calls
  timer(0, 5000).subscribe(() => {
    this.isInitialLoad = false;
    this.loadAnalytics();
  });
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
        this.checkUpdatedCards(data, this.analyticsData);
        this.previousAnalyticsData = { ...this.analyticsData };
        this.analyticsData = data;
        this.totalEmployee = data.user_type_counts['pupt-employee'];
      },
      (error) => {
        console.error('Error fetching analytics data', error);
      }
    );
  }

  checkUpdatedCards(newData: any, oldData: any) {
    this.updatedCards.clear(); // Reset updated cards set

    for (const key in newData) {
      if (typeof newData[key] === 'object') {
        for (const subKey in newData[key]) {
          if (newData[key][subKey] !== (oldData[key]?.[subKey] || 0)) {
            this.updatedCards.add(`${key}.${subKey}`);
          }
        }
      } else if (newData[key] !== (oldData[key] || 0)) {
        this.updatedCards.add(key);
      }
    }
  }

  isCardUpdated(key: string): boolean {
    return this.updatedCards.has(key);
  }

  ngAfterViewInit() {
    this.updateScrollDirection();
  }

  @HostListener('window:resize') onResize() {
    this.updateScrollDirection();
  }

  updateScrollDirection() {
    const container = this.scrollContainer.nativeElement;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    this.scrollDirection = container.scrollLeft >= maxScrollLeft - 50 ? 'left' : 'right';
  }

  toggleScroll() {
    const container = this.scrollContainer.nativeElement;

    if (this.scrollDirection === 'right') {
      container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
    } else {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    }

    this.scrollDirection = this.scrollDirection === 'right' ? 'left' : 'right';
  }

  onScroll() {
    this.updateScrollDirection();
  }
}
