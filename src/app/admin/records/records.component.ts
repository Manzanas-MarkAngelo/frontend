import { Component, OnInit } from '@angular/core';
import { RecordsService } from '../../../services/records.service';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})
export class RecordsComponent implements OnInit {
  selectedRole: string = 'Student';
  currentLogType: string = '';
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