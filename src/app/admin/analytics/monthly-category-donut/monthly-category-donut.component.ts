import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ChartsService } from '../../../../services/charts.service';

Chart.register(...registerables);

@Component({
  selector: 'app-monthly-category-donut',
  templateUrl: './monthly-category-donut.component.html',
  styleUrls: ['./monthly-category-donut.component.css']
})
export class MonthlyCategoryDonutComponent implements OnInit, AfterViewInit {
  @ViewChild('doughnutChart', { static: false }) private chartRef!: ElementRef;
  public chart: any;
  public year: number = new Date().getFullYear();
  public years: number[] = [];
  public month: number = new Date().getMonth() + 1;
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

  constructor(private chartsService: ChartsService) {}

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
    this.chartsService.getMonthlyBorrowingData(year, month)
      .subscribe(data => {
        console.log('Data received for chart:', data);
        this.createChart(data);
      }, error => {
        console.error('Error fetching data:', error);
      });
  }

  createChart(data: any) {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    const labels = Object.keys(data);
    const values = Object.values(data);

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'Borrowed Books by Category',
          data: values,
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#FF6384', '#36A2EB'
          ],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'The Ratio of Material Catogry Borrowed Monthly',
            font: {
              size: 14
            },
            position: 'bottom',
            padding: {
              top: 10,
              bottom: 20
            }
          },
          legend: {
            display: true,
            position: 'bottom'
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
