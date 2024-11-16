import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ChartsService } from '../../../../services/charts.service';

Chart.register(...registerables);

@Component({
  selector: 'app-courses-timed-in',
  templateUrl: './courses-timed-in.component.html',
  styleUrls: ['./courses-timed-in.component.css']
})
export class CoursesTimedInComponent implements OnInit, AfterViewInit {
  @ViewChild('pieChart', { static: false }) private chartRef!: ElementRef;
  public chart: any;
  public year: number = new Date().getFullYear();
  public month: number = new Date().getMonth() + 1;
  public years: number[] = [];
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
    this.chartsService.getCourseCounts(year, month)
      .subscribe(data => {
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
  
    const labels = data.map((item: any) => item.course_abbreviation);
    const values = data.map((item: any) => item.student_count);
  
    const backgroundColors = [
      '#FF6F61',
      '#6B5B93',
      '#88B04B',
      '#F7CAC9',
      '#92A8D1',
      '#955251',
      '#B9D3C1',
      '#F15A29',
      '#A35E8D',
      '#7A9E9F',
      '#F2C94C'
    ];
  
    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Student Count by Course',
          data: values,
          backgroundColor: backgroundColors.slice(0, labels.length),
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `Monthly Student Count by Course for ${this.months[this.month - 1].name}, ${this.year}`,
            font: {
              size: 18
            },
            position: 'bottom',
            padding: {
              top: 20,
              bottom: 10
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