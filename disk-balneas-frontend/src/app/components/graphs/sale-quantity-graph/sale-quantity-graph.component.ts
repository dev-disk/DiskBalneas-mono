import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartOptions } from '../invoiced-graph/invoiced-graph.component';

@Component({
  selector: 'app-sale-quantity-graph',
  imports: [NgApexchartsModule],
  templateUrl: './sale-quantity-graph.component.html',
  styleUrl: './sale-quantity-graph.component.css',
})
export class SaleQuantityGraphComponent implements OnChanges {
  @Input() saleQuantityData: number[] = [];
  @Input() categories: string[] = [];
  public chartOptions: ChartOptions;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Quant. Vendas',
          data: [],
        },
      ],
      chart: {
        height: 350,
        type: 'bar'
      },
      title: {
        text: 'Quant. Vendas Mensais',
      },
      xaxis: {
        categories: [],
      },
      tooltip: {
        enabled: true,
        theme: 'dark',
        
        fillSeriesColor: false,

      }
    };
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['saleQuantityData'] || changes['categories']) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    this.chartOptions.series = [
      {
        name: 'Quant. Vendas',
        data: this.saleQuantityData
      },
    ];
    this.chartOptions.xaxis = {
      categories: this.categories
    };
  }
}
