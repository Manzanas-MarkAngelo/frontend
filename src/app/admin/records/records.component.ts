import { Component, OnInit, ViewChild } from '@angular/core';
import { RecordsService } from '../../../services/records.service';
import { EmailService } from '../../../services/email.service';
import { Subject, debounceTime } from 'rxjs';
import { SnackbarComponent } from '../snackbar/snackbar.component';

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
  searchSubject: Subject<string> = new Subject<string>();
  isSending = false;

  selectAllChecked: boolean = false;

  @ViewChild(SnackbarComponent) snackbar: SnackbarComponent;

  constructor(private recordsService: RecordsService, private emailService: EmailService) { }

  ngOnInit(): void {
    this.setLogType('student');
    
    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(term => {
      this.searchTerm = term;
      this.fetchCurrentTypeData();
    });
  }

  capitalize(value: string): string {
    if (!value) return value;
    return value
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  setLogType(logType: string) {
    if (logType === 'default') {
      this.selectedRole = 'student';
    }

    this.currentLogType = logType;
    this.currentPage = 1;
    this.updateSearchPlaceholder(logType);
  }

  updateSearchPlaceholder(logType: string) {
    switch (logType) {
      case 'student':
      case 'faculty':
      case 'visitor':
      case 'pupt-employee': 
        this.searchPlaceholder = 'Search ' + logType;
        this.fetchRecords(logType);
        break;
      case 'student_log':
      case 'faculty_log':
      case 'visitor_log':
        this.searchPlaceholder = 'Search ' + logType.split('_')[0] + ' log';
        this.fetchLogs(logType.split('_')[0]);
        break;
      default:
        this.searchPlaceholder = 'Search student';
        this.fetchRecords('student');
    }
  }

  fetchLogs(logType: string) {
    this.recordsService.getLogs(logType, this.itemsPerPage, this.currentPage, this.searchTerm)
      .subscribe({
        next: (data) => {
          this.logs = data.records;
          this.totalPages = data.totalPages;
        },
        error: () => {
          this.snackbar.showMessage('Error fetching logs. Please check the network or contact support.');
        }
      });
  }

  fetchRecords(recordType: string) {
    this.recordsService.getRecords(recordType, this.itemsPerPage, this.currentPage, this.searchTerm)
      .subscribe({
        next: (data) => {
          this.logs = data.records;
          this.totalPages = data.totalPages;
        },
        error: () => {
          this.snackbar.showMessage('Error fetching records. Please check the network or contact support.');
        }
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

  onSearchChange(searchTerm: string) {
    this.searchSubject.next(searchTerm);
  }

  clearLogType() {
    this.selectedRole = 'student';
    this.setLogType('student');
    this.searchTerm = '';
  }

  toggleAllSelection(event: any) {
    this.selectAllChecked = event.target.checked;
    this.logs.forEach(record => record.selected = this.selectAllChecked);
  }

  checkIfAllSelected() {
    this.selectAllChecked = this.logs.every(record => record.selected);
  }

  anySelected(): boolean {
    return this.logs.some(log => log.selected);
  }

  sendEmailsToSelectedFaculty(): void {
    const selectedEmails = this.logs.filter(log => log.selected).map(log => log.email);
    if (selectedEmails.length > 0) {
      this.isSending = true;
      this.emailService.sendEmail(selectedEmails).subscribe({
        next: () => {
          this.snackbar.showMessage('Emails have been sent successfully');
          this.logs.forEach(log => log.selected = false);
          this.selectAllChecked = false;
        },
        error: () => {
          this.snackbar.showMessage('Failed to send emails. Please try again.');
        },
        complete: () => {
          this.isSending = false;
        }
      });
    } else {
      this.snackbar.showMessage('No faculty members selected for email.');
    }
  }
}