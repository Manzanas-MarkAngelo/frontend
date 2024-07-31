import { Component, OnInit } from '@angular/core';
import { RecordsService } from '../../../services/records.service';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})
export class RecordsComponent implements OnInit {
  selectedRole: string = 'student';
  currentLogType: string = 'default';
  searchPlaceholder: string = 'Search student';
  logs: any[] = [];

  constructor(private recordsService: RecordsService) { }

  ngOnInit(): void {
    this.setLogType('default');
  }

  setLogType(logType: string) {
    if (logType === 'default') {
      this.selectedRole = 'student';
    }

    this.currentLogType = logType;
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
    this.recordsService.getLogs(logType).subscribe(data => {
      this.logs = data;
    }, error => {
      console.error('Error fetching logs:', error);
    });
  }

  fetchRecords(recordType: string) {
    this.recordsService.getRecords(recordType).subscribe(data => {
      this.logs = data;
    }, error => {
      console.error('Error fetching records:', error);
    });
  }
}