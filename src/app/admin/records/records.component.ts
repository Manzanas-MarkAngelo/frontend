import { Component, OnInit } from '@angular/core';
import { RecordsService } from '../../../services/records.service';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})
export class RecordsComponent implements OnInit {
  selectedRole: string = 'student';
  currentLogType: string = 'student';
  searchPlaceholder: string = 'Search student';
  logs: any[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  itemsPerPage: number = 14;
  searchTerm: string = '';
  searchSubject: Subject<string> = new Subject<string>(); // For debounced search

  constructor(private recordsService: RecordsService) { }

  ngOnInit(): void {
    this.setLogType('student');
    
    // Implement debounce on search input
    this.searchSubject.pipe(
      debounceTime(300) // Adjust debounce time as needed
    ).subscribe(term => {
      this.searchTerm = term;
      this.fetchCurrentTypeData(); // Fetch records or logs based on selected log type
    });
  }

  setLogType(logType: string) {
    if (logType === 'default') {
      this.selectedRole = 'student';
    }

    this.currentLogType = logType;
    this.currentPage = 1;
    switch (logType) {
      case 'student':
        this.searchPlaceholder = 'Search student';
        this.fetchRecords('student');
        break;
      case 'faculty':
        this.searchPlaceholder = 'Search faculty';
        this.fetchRecords('faculty');
        break;
      case 'visitor':
        this.searchPlaceholder = 'Search visitor';
        this.fetchRecords('visitor');
        break;
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
        this.fetchRecords('student');
    }
  }

  fetchLogs(logType: string) {
    this.recordsService.getLogs(logType, this.itemsPerPage, this.currentPage, this.searchTerm).subscribe(data => {
      this.logs = data.records;
      this.totalPages = data.totalPages;
    }, error => {
      console.error('Error fetching logs:', error);
    });
  }

  fetchRecords(recordType: string) {
    this.recordsService.getRecords(recordType, this.itemsPerPage, this.currentPage, this.searchTerm).subscribe(data => {
      this.logs = data.records;
      this.totalPages = data.totalPages;
    }, error => {
      console.error('Error fetching records:', error);
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchCurrentTypeData();
  }

  fetchCurrentTypeData() {
    if (this.currentLogType.includes('log')) {
      this.fetchLogs(this.currentLogType.replace('_log', ''));
    } else {
      this.fetchRecords(this.currentLogType);
    }
  }

  // Trigger search with debounce
  onSearchChange(searchTerm: string) {
    this.searchSubject.next(searchTerm); // Pass the search term to the debounced subject
  }

  clearLogType() {
    this.setLogType('student');
    this.searchTerm = ''; // Clear the search term
  }
}
