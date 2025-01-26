import { Component, OnInit } from '@angular/core';
import { TimeService } from '../../services/time.service';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css']
})
export class TimeComponent implements OnInit {
  time: Date;
  date: string;

  constructor(private timeService: TimeService) {
    this.time = new Date();
    this.date = this.formatDate(this.time);
  }

  ngOnInit() {
    this.fetchServerTime(); // Initial fetch from server

    // Update the server time periodically every second (1000 ms)
    setInterval(() => {
      this.fetchServerTime();
    }, 1000); // 1000 ms = 1 second
  }

  // Fetch the current server time from the backend
  private fetchServerTime(): void {
    this.timeService.getServerTime().subscribe(response => {
      this.time = new Date(response.currentTime); // Update the time using the server's time
      this.date = this.formatDate(this.time); // Format the date as required
    }, error => {
      console.error('Error fetching server time:', error);
    });
  }

  // Format the date in a readable way
  private formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  }
}
