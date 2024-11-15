import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ChartsService } from '../../../../services/charts.service';

Chart.register(...registerables);

@Component({
  selector: 'app-feedback-question-3',
  templateUrl: './feedback-question-3.component.html',
  styleUrls: ['./feedback-question-3.component.css']
})
export class FeedbackQuestion3Component implements OnInit, AfterViewInit {
  @ViewChild('pieChart', { static: false }) private chartRef!: ElementRef;
  public chart: any;
  private questionNumber = 3;

  constructor(private chartsService: ChartsService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.fetchFeedbackData();
  }

  fetchFeedbackData() {
    this.chartsService.getFeedbackResponses(this.questionNumber)
      .subscribe(data => {
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

    const labels = Object.keys(data.responses);
    const values = Object.values(data.responses);

    const backgroundColors = [
      '#FF6F61',
      '#6B5B93',
      '#88B04B',
      '#F7CAC9',
      '#92A8D1'
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
            text: `Question 3: ${data.question}`,
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