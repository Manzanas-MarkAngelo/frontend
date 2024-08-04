import { Component, OnInit } from '@angular/core';
import { RecordsService } from '../../../services/records.service';

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
  itemsPerPage: number = 13;

  constructor(private recordsService: RecordsService) { }

  ngOnInit(): void {
    this.fetchRecords();
  }

  fetchRecords() {
    this.recordsService.getRecords('visitor', this.itemsPerPage, this.currentPage).subscribe(data => {
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
}