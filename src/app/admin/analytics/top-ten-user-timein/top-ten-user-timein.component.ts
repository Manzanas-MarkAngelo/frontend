import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ChartsService } from '../../../../services/charts.service'; // Adjust path if needed

Chart.register(...registerables);

@Component({
  selector: 'app-top-ten-user-timein',
  templateUrl: './top-ten-user-timein.component.html',
  styleUrls: ['./top-ten-user-timein.component.css']
})
export class TopTenUserTimeinComponent implements OnInit, AfterViewInit {
  @ViewChild('barChart', { static: false }) private chartRef!: ElementRef;
  public chart: any;
  public year: number;
  public years: number[] = [];
  public month: number;
  public months: { name: string, value: number }[] = [
    { name: 'January', value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'November', value: 11 },
    { name: 'December', value: 12 }
  ];

  // Translucent colors with alpha values for background
  private backgroundColors: string[] = [
    'rgba(255, 99, 132, 0.2)',  // Red
    'rgba(255, 159, 64, 0.2)',  // Orange
    'rgba(255, 205, 86, 0.2)',  // Yellow
    'rgba(75, 192, 192, 0.2)',  // Teal
    'rgba(54, 162, 235, 0.2)',  // Blue
    'rgba(153, 102, 255, 0.2)', // Purple
    'rgba(37, 149, 102, 0.2)'  // Grey
  ];

  // Fully opaque colors for borders
  private borderColors: string[] = [
    'rgb(255, 99, 132)',  // Red
    'rgb(255, 159, 64)',  // Orange
    'rgb(255, 205, 86)',  // Yellow
    'rgb(75, 192, 192)',  // Teal
    'rgb(54, 162, 235)',  // Blue
    'rgb(153, 102, 255)', // Purple
    'rgba(37, 149, 102, 1)'  // Grey
  ];

  constructor(private chartsService: ChartsService) {
    const now = new Date();
    this.year = now.getFullYear();
    this.month = now.getMonth() + 1; // Current month (1-based index)
  }

  ngOnInit() {
    this.initializeYears();
  }

  ngAfterViewInit() {
    this.fetchData(this.year, this.month);
  }

  initializeYears() {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  }

  fetchData(year: number, month: number) {
    this.chartsService.getTopTenUsers(year, month)
      .subscribe(data => {
        console.log('Data received:', data); 
        if (data && data.data) {
          this.createChart(data, month, year);
        } else {
          console.error('Data is not properly formatted or missing');
        }
      }, error => {
        console.error('Error fetching data:', error);
      });
  }

  createChart(data: any, month: number, year: number) {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }
  
    if (this.chart) {
      this.chart.destroy();
    }
  
    // Prepare data for the bar chart
    const labels = data.data.map((item: any) => {
      const fullName = `${item.first_name} ${item.surname}`;
      return fullName.length > 17 ? item.surname : fullName;
    });
    const values = data.data.map((item: any) => item.times_in);
  
    // Generate colors for each bar
    const numBars = labels.length;
    const backgroundColors = this.backgroundColors.slice(0, numBars);
    const borderColors = this.borderColors.slice(0, numBars);
  
    // Update chart title based on the number of users
    const monthName = this.months.find(m => m.value === month)?.name || 'Unknown';
    const chartTitle = numBars === 1 
      ? `Top User for ${monthName}, ${year}` 
      : `Top ${numBars} Users for ${monthName}, ${year}`;
  
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Number of Time-Ins',
          data: values,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: chartTitle,
            font: {
              size: 18
            },
            position: 'top',
            padding: {
              top: 35,
              bottom: 10
            }
          },
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.raw} times`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Users',
              font: {
                weight: 'bold',
                size: 14
              }
            }
          },
          y: {
            title: {
              display: true,
              text: 'Number of Time-Ins',
              font: {
                weight: 'bold',
                size: 14
              }
            }
          }
        }
      }
    });
  }
  
  onYearChange(event: any) {
    const selectedYear = +event.target.value;
    this.fetchData(selectedYear, this.month);
  }

  onMonthChange(event: any) {
    const selectedMonth = +event.target.value;
    this.fetchData(this.year, selectedMonth);
  }
}
