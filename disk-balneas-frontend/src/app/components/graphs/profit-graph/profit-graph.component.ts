import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartOptions } from '../invoiced-graph/invoiced-graph.component';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-profit-graph',
  imports: [NgApexchartsModule],
  templateUrl: './profit-graph.component.html',
  styleUrl: './profit-graph.component.css',
})
export class ProfitGraphComponent implements OnChanges {
  @Input() profitData: number[] = [];
  @Input() categories: string[] = [];
  public chartOptions: ChartOptions;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Lucro',
          data: [],
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
      },
      title: {
        text: 'Lucro Mensal',
      },
      xaxis: {
        categories: [],
      },
      tooltip: {
        enabled: true,
        theme: 'dark'
      }
    };
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['profitData'] || changes['categories']) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    this.chartOptions.series = [
      {
        name: 'Lucro',
        data: this.profitData
      },
    ];
    this.chartOptions.xaxis = {
      categories: this.categories
    };
  }
}
