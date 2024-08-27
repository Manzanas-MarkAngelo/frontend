import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ChartsService } from '../../../../services/charts.service';

Chart.register(...registerables);

@Component({
  selector: 'app-monthly-users',
  templateUrl: './monthly-users.component.html',
  styleUrls: ['./monthly-users.component.css']
})
export class MonthlyUsersComponent implements OnInit, AfterViewInit {
  @ViewChild('lineChart', { static: false }) private chartRef!: ElementRef;
  public chart: any;
  public year: number = new Date().getFullYear();
  public years: number[] = [];

  constructor(private chartsService: ChartsService) {}

  ngOnInit() {
    this.initializeYears();
  }

  ngAfterViewInit() {
    this.fetchData(this.year);
  }

  initializeYears() {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  }

  fetchData(year: number) {
    this.chartsService.getMonthlyData(year)
      .subscribe(data => {
        console.log('Data received for chart:', data); // Log the data to check its format
        this.createChart(data, year);
      }, error => {
        console.error('Error fetching data:', error); // Log any errors
      });
  }

  createChart(data: any, selectedYear: number) {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    const currentMonth = new Date().getMonth(); // Get the current month (0-based index)
    const currentYear = new Date().getFullYear();
    const allMonths = ['January', 'February', 'March', 
                       'April', 'May', 'June', 
                       'July', 'August', 'September', 
                       'October', 'November', 'December'];

    let displayedMonths = allMonths;
    let displayedUsers = Object.values(data);

    if (selectedYear === currentYear) {
      // If the selected year is the current year, show only up to the current month
      displayedMonths = allMonths.slice(0, currentMonth + 1);
      displayedUsers = displayedUsers.slice(0, currentMonth + 1);
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: displayedMonths, // Use filtered month names as labels
        datasets: [{
          label: 'Number of Users',
          data: displayedUsers, // Filtered user counts for each month
          borderColor: '#FF5733',
          backgroundColor: 'rgba(255, 87, 51, 0.2)',
          borderWidth: 2,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Users'
            }
          }
        }
      }
    });
  }

  onYearChange(event: any) {
    const selectedYear = +event.target.value; // Ensure selectedYear is treated as a number
    this.fetchData(selectedYear);
  }
}
