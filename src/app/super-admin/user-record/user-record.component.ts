import { Component, OnInit } from '@angular/core';
import { RecordsService } from '../../../services/records.service';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-user-record',
  templateUrl: './user-record.component.html',
  styleUrls: ['./user-record.component.css']
})
export class UserRecordComponent implements OnInit {
  currentLogType: string = 'student_log';
  searchPlaceholder: string = 'Search Student Log';
  logs: any[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  itemsPerPage: number = 10;
  itemsPerPageOptions: number[] = [10, 25, 50, 100, 500, 1000];
  searchTerm: string = '';
  searchSubject: Subject<string> = new Subject<string>();

  constructor(private recordsService: RecordsService) { }

  ngOnInit(): void {
    this.setLogType('student_log');
    
    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(term => {
      this.searchTerm = term;
      this.fetchLogs(this.currentLogType.replace('_log', ''));
    });
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
        this.searchPlaceholder = 'Search student log';
        this.fetchLogs('student');
    }
  }

  fetchLogs(logType: string) {
    this.recordsService.getLogs(
      logType, 
      this.itemsPerPage, 
      this.currentPage, 
      this.searchTerm
    ).subscribe(data => {
      this.logs = data.records;
      this.totalPages = data.totalPages;
    }, error => {
      console.error('Error fetching logs:', error);
    });
  }

  onItemsPerPageChange(event: any) {
    this.itemsPerPage = event.target.value;
    this.currentPage = 1;
    this.fetchLogs(this.currentLogType.replace('_log', ''));
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchLogs(this.currentLogType.replace('_log', ''));
  }

  clearLogType() {
    this.setLogType('student_log');
    this.searchTerm = '';
    this.fetchLogs(this.currentLogType.replace('_log', ''));
  }
  
  onSearchChange(searchTerm: string) {
    this.searchSubject.next(searchTerm);
  }
}