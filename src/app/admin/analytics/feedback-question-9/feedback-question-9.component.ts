import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ChartsService } from '../../../../services/charts.service';

Chart.register(...registerables);

@Component({
  selector: 'app-feedback-question-9',
  templateUrl: './feedback-question-9.component.html',
  styleUrls: ['./feedback-question-9.component.css']
})
export class FeedbackQuestion9Component implements OnInit, AfterViewInit {
  @ViewChild('pieChart', { static: false }) private chartRef!: ElementRef;
  public chart: any;
  private questionNumber = 9;

  constructor(private chartsService: ChartsService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.fetchFeedbackData();
  }

  fetchFeedbackData() {
    this.chartsService.getFeedbackResponses(this.questionNumber)
      .subscribe(data => {
        console.log('Data received for chart:', data);
        this.createChart(data);
      }, error => {
        console.error('Error fetching feedback data:', error);
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

    // Extract labels and values from the response data
    const labels = Object.keys(data.responses);
    const values = Object.values(data.responses);

    // Colors for the pie chart segments
    const backgroundColors = [
      '#FF6F61', // Coral
      '#6B5B93', // Purple
      '#88B04B', // Olive Green
      '#F7CAC9', // Light Pink
      '#92A8D1'  // Light Blue
    ];

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: data.question,
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
            text: `Question 9: ${data.question}`,  // Using the question text from the backend response
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
}
