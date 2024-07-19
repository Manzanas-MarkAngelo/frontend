import { Component } from '@angular/core';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrl: './records.component.css'
})
export class RecordsComponent {
  currentLogType: string = '';
  searchPlaceholder: string = 'Search student';

  setLogType(logType: string) {
    this.currentLogType = logType;
    switch (logType) {
      case 'student':
        this.searchPlaceholder = 'Search student';
        break;
      case 'faculty':
        this.searchPlaceholder = 'Search faculty';
        break;
      case 'visitor':
        this.searchPlaceholder = 'Search visitor';
        break;
      default:
        this.searchPlaceholder = 'Search';
    }
  }
}
