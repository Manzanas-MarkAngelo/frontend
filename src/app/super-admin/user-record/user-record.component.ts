import { Component, OnInit } from '@angular/core';
import { RecordsService } from '../../../services/records.service';

@Component({
  selector: 'app-user-record',
  templateUrl: './user-record.component.html',
  styleUrl: './user-record.component.css'
})
export class UserRecordComponent {
  currentLogType: string = 'default';
  searchPlaceholder: string = 'Search Student Log';
  logs: any[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  itemsPerPage: number = 13;

  constructor(private recordsService: RecordsService) { }

  ngOnInit(): void {
    this.setLogType('default');
  }

  setLogType(logType: string) {
    this.currentLogType = logType;
    this.currentPage = 1;
    switch (logType) {
      case 'student_log':
        this.searchPlaceholder = 'Search student log';
        this.fetchLogs('student');
        break;
      case 'faculty_log':
        this.searchPlaceholder = 'Search faculty log';
        this.fetchLogs('faculty');
        break;
      case 'visitor_log':
        this.searchPlaceholder = 'Search visitor log';
        this.fetchLogs('visitor');
        break;
      default:
        this.searchPlaceholder = 'Search student';
        this.fetchLogs('student');
    }
  }

  fetchLogs(logType: string) {
    this.recordsService.getLogs(logType, this.itemsPerPage, this.currentPage).subscribe(data => {
      this.logs = data.records;
      this.totalPages = data.totalPages;
    }, error => {
      console.error('Error fetching logs:', error);
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchCurrentTypeData();
  }

  fetchCurrentTypeData() {
    if (this.currentLogType.includes('log')) {
      this.fetchLogs(this.currentLogType.replace('_log', ''));
    }
  }
}