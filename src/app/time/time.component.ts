import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css']
})
export class TimeComponent implements OnInit {
  time: Date;
  date: string;

  constructor() {
    this.time = new Date();
    this.date = this.formatDate(this.time);
  }

  ngOnInit() {
    setInterval(() => {
      this.time = new Date();
      this.date = this.formatDate(this.time);
    }, 1000);
  }

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