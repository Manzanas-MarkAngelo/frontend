import { Component, OnInit, ViewChild } from '@angular/core';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { ExcludeDaysService } from '../../../services/exclude-days.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;

  calendarDates: { date: string, day: number, isSunday: boolean }[] = []; 
  excludedDates: Set<string> = new Set();
  selectedDates: Set<string> = new Set();
  today = new Date();
  currentMonth: string;
  selectedYear: number;
  selectedMonth: string;
  yearStart = 2024;
  availableYears: number[] = [];
  months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 
    'September', 'October', 'November', 'December'
  ];
  dropdownVisible = false;
  showConfirmationModal: boolean = false;
  datesToExclude: Set<string> = new Set();
  formattedDatesToExclude: string[] = [];
  dateToRemove: string = '';
  showRemoveConfirmationModal: boolean = false;

  constructor(private excludeDaysService: ExcludeDaysService) {
    this.selectedYear = this.today.getFullYear();
    this.selectedMonth = this.months[this.today.getMonth()];
    this.currentMonth = this.selectedMonth;

    const yearsCount = 10;
    this.availableYears = Array.from({ length: yearsCount }, (_, index) => this.yearStart + index);
  }

  ngOnInit(): void {
    this.fetchExcludedDates();
    this.generateCalendarDates();
  }

  fetchExcludedDates() {
    this.excludeDaysService.getExcludedDays().subscribe((dates: string[]) => {
      this.excludedDates = new Set(dates);
    });
  }

  generateCalendarDates() {
    const daysInMonth = new Date(this.selectedYear, this.months.indexOf(this.selectedMonth) + 1, 0).getDate();
    const firstDayOfMonth = new Date(this.selectedYear, this.months.indexOf(this.selectedMonth), 1).getDay();
  
    this.calendarDates = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(this.selectedYear, this.months.indexOf(this.selectedMonth), i);
      const formattedDate = `${day.getFullYear()}-${(day.getMonth() + 1).toString().padStart(2, '0')}-${day.getDate().toString().padStart(2, '0')}`;
      this.calendarDates.push({
        date: formattedDate,
        day: i,
        isSunday: day.getDay() === 0
      });
    }
  
    for (let i = 0; i < firstDayOfMonth; i++) {
      this.calendarDates.unshift({ date: '', day: null, isSunday: false });
    }
  }

  navigateMonth(direction: 'prev' | 'next') {
    const currentMonthIndex = this.months.indexOf(this.selectedMonth);
    let newMonthIndex = currentMonthIndex + (direction === 'prev' ? -1 : 1);

    if (newMonthIndex < 0) {
      this.selectedYear--;
      newMonthIndex = 11;
    } else if (newMonthIndex > 11) {
      this.selectedYear++;
      newMonthIndex = 0;
    }

    this.selectedMonth = this.months[newMonthIndex];
    this.currentMonth = this.selectedMonth;
    this.generateCalendarDates();
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  onYearChange() {
    this.generateCalendarDates();
    this.toggleDropdown();
  }

  toggleDateSelection(date: string) {
    if (this.selectedDates.has(date)) {
      this.selectedDates.delete(date);
    } else {
      this.selectedDates.add(date);
    }
  }

  confirmExclusion() {
    if (this.selectedDates.size === 0) {
      this.snackbar.showMessage('No dates selected for exclusion.');
      return;
    }
  
    this.datesToExclude = new Set(this.selectedDates);
  
    this.formattedDatesToExclude = Array.from(this.datesToExclude).map(date => {
      const dateObj = new Date(date);
      return `${dateObj.getDate().toString().padStart(2, '0')}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getFullYear()}`;
    });
  
    this.showConfirmationModal = true;
  }
  
  onConfirmExclusion() {
    const selectedDatesArray = Array.from(this.datesToExclude);
    this.excludeDaysService.excludeDates(selectedDatesArray).subscribe(
      () => {
        this.snackbar.showMessage('Selected dates have been excluded.');
        this.fetchExcludedDates();
        this.selectedDates.clear();
        this.showConfirmationModal = false;
      },
      () => {
        this.snackbar.showMessage('Failed to exclude selected dates.');
        this.showConfirmationModal = false;
      }
    );
  }

  onCancelExclusion() {
    this.showConfirmationModal = false;
    this.selectedDates.clear();
  }

  openRemoveDateModal(date: string) {
    this.dateToRemove = date;
    this.showRemoveConfirmationModal = true;
  }

  onConfirmRemoveDate() {
    this.excludeDaysService.removeExcludedDate(this.dateToRemove).subscribe(
      () => {
        this.snackbar.showMessage('Date has been removed from exclusion.');
        this.fetchExcludedDates();
        this.showRemoveConfirmationModal = false;
      },
      () => {
        this.snackbar.showMessage('Failed to remove the date from exclusion.');
        this.showRemoveConfirmationModal = false;
      }
    );
  }

  onCancelRemoveDate() {
    this.showRemoveConfirmationModal = false;
    this.dateToRemove = '';
  }

  isExcluded(date: string): boolean {
    return this.excludedDates.has(date);
  }
}