import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { StatisticsService } from '../../services/statistics.service';
import { IStatisticResponse } from '../../interfaces/IStatisticResponse';
import { InvoicedGraphComponent } from '../../components/graphs/invoiced-graph/invoiced-graph.component';
import { ProfitGraphComponent } from '../../components/graphs/profit-graph/profit-graph.component';
import { CommonModule } from '@angular/common';
import { SaleQuantityGraphComponent } from "../../components/graphs/sale-quantity-graph/sale-quantity-graph.component";

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    InvoicedGraphComponent,
    ProfitGraphComponent,
    SaleQuantityGraphComponent
],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css',
})
export class StatisticsComponent implements OnInit {
  constructor(private readonly statisticsService: StatisticsService) {}

  isDataLoaded: boolean = false;

  ngOnInit(): void {
    this.loadStatistics();
    this.showInvoicedGraph = true;
  }

  statistics: IStatisticResponse[] = [];
  currentStatistic: IStatisticResponse = {} as IStatisticResponse;
  invoicedData: number[] = [];
  profitData: number[] = [];
  saleQuantityData: number[] = [];
  categories: string[] = [];

  showInvoicedGraph: boolean = false;
  showProfitGraph: boolean = false;
  showSaleQuantityGraph: boolean = false;

  loadStatistics() {
    this.statisticsService.getStatistics().subscribe({
      next: (response) => {
        this.statistics = response.data;
        this.currentStatistic = this.getStatisticsPerMonth();
        this.processStatisticsForCurrentYear();
        this.isDataLoaded = true;
      },
      error: (error) => {
        console.error('Erro ao carregar estatísticas:', error);
      },
    });
  }

  loadInvoicedGraph(): void {
    this.showInvoicedGraph = true;
    this.showProfitGraph = false;
    this.showSaleQuantityGraph = false
  }

  loadProfitGraph(): void {
    this.showProfitGraph = true;
    this.showInvoicedGraph = false;
    this.showSaleQuantityGraph = false
  }

  loadsaleQuantityGraph(): void {
    this.showSaleQuantityGraph = true
    this.showProfitGraph = false;
    this.showInvoicedGraph = false;
  }

  private getStatisticsPerMonth(): IStatisticResponse {
    const now = new Date();
    const currentYear = now.getUTCFullYear();
    const currentMonth = now.getUTCMonth();

    const statistic = this.statistics.find((d) => {
      const date = new Date(d.date);
      return (
        date.getUTCFullYear() === currentYear &&
        date.getUTCMonth() === currentMonth
      );
    });

    return statistic || ({} as IStatisticResponse);
  }

  private processStatisticsForCurrentYear(): void {
    const now = new Date();
    const currentYear = now.getUTCFullYear();

    const yearlyStatistics = this.statistics.filter((stat) => {
      const date = new Date(stat.date);
      return date.getUTCFullYear() === currentYear;
    });

    this.invoicedData = new Array(12).fill(0);
    this.profitData = new Array(12).fill(0);
    this.saleQuantityData = new Array(12).fill(0);
    this.categories = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    yearlyStatistics.forEach((stat) => {
      const date = new Date(stat.date);
      const month = date.getUTCMonth();
      this.invoicedData[month] = stat.totalInvoiced;
      this.profitData[month] = stat.totalProfit;
      this.saleQuantityData[month] = stat.totalSaleQuantity;
    });
  }
}
