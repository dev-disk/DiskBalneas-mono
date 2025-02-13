import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-invoiced-graph',
  imports: [NgApexchartsModule],
  templateUrl: './invoiced-graph.component.html',
  styleUrl: './invoiced-graph.component.css',
})
export class InvoicedGraphComponent implements OnChanges {
  @Input() invoiceData: number[] = [];
  @Input() categories: string[] = [];
  public chartOptions: ChartOptions;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Faturamento',
          data: [],
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
      },
      title: {
        text: 'Faturamento Mensal',
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
    if(changes['invoiceData'] || changes['categories']) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    this.chartOptions.series = [
      {
        name: 'Faturamento',
        data: this.invoiceData
      },
    ];
    this.chartOptions.xaxis = {
      categories: this.categories
    };
  }
}
