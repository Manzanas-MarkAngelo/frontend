import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ChartsService } from '../../../../services/charts.service';

Chart.register(...registerables);

@Component({
  selector: 'app-most-borrowed',
  templateUrl: './most-borrowed.component.html',
  styleUrls: ['./most-borrowed.component.css']
})
export class MostBorrowedComponent implements OnInit {
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

  constructor(private chartsService: ChartsService) {
    const now = new Date();
    this.year = now.getFullYear();
    this.month = now.getMonth() + 1;
  }

  ngOnInit() {
    this.initializeYears();
    this.fetchData(this.year, this.month);
  }

  initializeYears() {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  }

  fetchData(year: number, month: number) {
    this.chartsService.getTopTenBorrowedBooks(year, month)
      .subscribe(data => {
        console.log('Data received:', data); 
        if (data && data.data) {
          this.createHorizontalBarChart(data.data, month, year);
        } else {
          console.error('Data is not properly formatted or missing');
        }
      }, error => {
        console.error('Error fetching data:', error);
      });
  }

  createHorizontalBarChart(data: any[], month: number, year: number) {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }
  
    if (this.chart) {
      this.chart.destroy();
    }
  
    const labels = data.map(item => item.title);
    const values = data.map(item => item.times_borrowed);
  
    // Generate unique colors for each bar
    const backgroundColors = this.generateUniqueColors(data.length, 0.2);
    const borderColors = this.generateUniqueColors(data.length, 1);        
  
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Times Borrowed',
          data: values,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y', // Makes the chart horizontal
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `Top 10 Most Borrowed Books for ${this.months[month - 1]
                  .name}, ${year}`,
            font: {
              size: 18
            },
            padding: {
              top: 40,  // Adds padding at the top (acts like margin)
              bottom: 10
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw} times`
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: '',
              font: {
                weight: 'bold',
                size: 14
              }
            }
          },
          y: {
            title: {
              display: true,
              text: '',
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
  
// Helper function to generate unique colors
generateUniqueColors(count: number, opacity: number): string[] {
  const colors = [];
  const baseColors = [
    'rgba(200, 0, 0, OPACITY)',      // Dark Red
    'rgba(0, 200, 0, OPACITY)',      // Dark Green
    'rgba(0, 0, 200, OPACITY)',      // Dark Blue
    'rgba(200, 130, 0, OPACITY)',    // Dark Orange
    'rgba(100, 100, 100, OPACITY)',  // Dark Gray
    'rgba(100, 0, 100, OPACITY)',    // Dark Purple
    'rgba(200, 200, 0, OPACITY)',    // Dark Yellow
    'rgba(0, 200, 200, OPACITY)',    // Dark Cyan
    'rgba(100, 100, 0, OPACITY)',    // Dark Olive
    'rgba(0, 100, 100, OPACITY)',    // Dark Teal
    'rgba(160, 160, 160, OPACITY)',  // Dark Silver
    'rgba(200, 160, 180, OPACITY)',  // Light Pink
    'rgba(200, 85, 140, OPACITY)',   // Light Hot Pink
    'rgba(0, 0, 100, OPACITY)',      // Darker Blue
    'rgba(200, 70, 0, OPACITY)',     // Darker Orange
  ];

  for (let i = 0; i < count; i++) {
    const color = baseColors[i % baseColors.length].replace('OPACITY', 
          opacity.toString());
    colors.push(color);
  }

  return colors;
}


  onYearChange(event: any) {
    this.year = +event.target.value;
    this.fetchData(this.year, this.month);
  }

  onMonthChange(event: any) {
    this.month = +event.target.value;
    this.fetchData(this.year, this.month);
  }
}
