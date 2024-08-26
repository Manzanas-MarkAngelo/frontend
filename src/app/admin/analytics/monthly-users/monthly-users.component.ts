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
  public months: number[] = Array.from({ length: 12 }, (_, i) => i + 1);
  public selectedMonth: number | null = null; // Track selected month for daily data
  public years: number[] = [];
  public viewMode: 'monthly' | 'daily' = 'monthly'; // Track the selected view mode

  constructor(private chartsService: ChartsService) {}

  ngOnInit() {
    this.initializeYears();
  }

  ngAfterViewInit() {
    this.fetchData(this.year, this.viewMode, this.selectedMonth);
  }

  initializeYears() {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  }

  fetchData(year: number, viewMode: 'monthly' | 'daily', month?: number) {
    let dataObservable;
    if (viewMode === 'daily' && month) {
      dataObservable = this.chartsService.getDailyData(year, month);
    } else {
      dataObservable = this.chartsService.getMonthlyData(year);
    }

    dataObservable.subscribe(data => {
      console.log('Data received for chart:', data);
      this.createChart(data, year, viewMode);
    }, error => {
      console.error('Error fetching data:', error);
    });
  }

  createChart(data: any, selectedYear: number, viewMode: 'monthly' | 'daily') {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    let labels: string[];
    let values: number[];

    if (viewMode === 'daily') {
      labels = Object.keys(data);
      values = Object.values(data);
    } else {
      const allMonths = ['January', 'February', 'March', 
                         'April', 'May', 'June', 
                         'July', 'August', 'September', 
                         'October', 'November', 'December'];
      
      const currentMonth = new Date().getMonth(); // Get the current month (0-based index)
      labels = allMonths;
      values = allMonths.map(month => data[month] || 0);

      if (selectedYear === new Date().getFullYear()) {
        labels = labels.slice(0, currentMonth + 1);
        values = values.slice(0, currentMonth + 1);
      }
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Number of Users',
          data: values,
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
    const selectedYear = +event.target.value;
    this.year = selectedYear; // Update the current year
    this.fetchData(selectedYear, this.viewMode, this.selectedMonth);
  }

  onViewModeChange(event: any) {
    const selectedMode: 'monthly' | 'daily' = event.target.value;
    this.viewMode = selectedMode;
    this.fetchData(this.year, selectedMode, this.selectedMonth);
  }

  onMonthChange(event: any) {
    const selectedMonth = +event.target.value;
    this.selectedMonth = selectedMonth;
    if (this.viewMode === 'daily') {
      this.fetchData(this.year, 'daily', selectedMonth);
    }
  }
}
