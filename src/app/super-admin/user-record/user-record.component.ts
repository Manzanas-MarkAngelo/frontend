import { Component, OnInit } from '@angular/core';
import { RecordsService } from '../../../services/records.service';

@Component({
  selector: 'app-user-record',
  templateUrl: './user-record.component.html',
  styleUrl: './user-record.component.css'
})
export class UserRecordComponent {
  currentLogType: string = 'student';
  searchPlaceholder: string = 'Search student';
  logs: any[] = [];

  constructor(private recordsService: RecordsService) { }

  ngOnInit(): void {
    this.setLogType('default');
  }

  setLogType(logType: string) {
    this.currentLogType = logType;
    switch (logType) {
      case 'student':
        this.searchPlaceholder = 'Search student';
        this.fetchLogs('student');
        break;
      case 'faculty':
        this.searchPlaceholder = 'Search faculty';
        this.fetchLogs('faculty');
        break;
      case 'visitor':
        this.searchPlaceholder = 'Search visitor';
        // this.fetchLogs('visitor');
        this.logs = [];
        break;
      default:
        this.searchPlaceholder = 'Search';
        this.fetchRecords();
    }
  }

  fetchLogs(logType: string) {
    this.recordsService.getLogs(logType).subscribe(data => {
      this.logs = data;
    });
  }

  fetchRecords() {
    this.recordsService.getRecords().subscribe(data => {
      this.logs = data;
    });
  }
}
