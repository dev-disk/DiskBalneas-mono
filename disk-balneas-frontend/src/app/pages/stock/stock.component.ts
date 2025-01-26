import { CommonModule } from "@angular/common";
import { Component, AfterViewInit, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule, MatPaginator } from "@angular/material/paginator";
import { MatTableModule, MatTableDataSource } from "@angular/material/table";
import { ProductService } from "../../services/product.service";
import { MatSort, MatSortModule } from "@angular/material/sort";

interface StockItem {
  product: string;
  amount: number;
  quantity: number;
  more: any;
}

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './stock.component.html',
})

export class StockComponent implements AfterViewInit {
  displayedColumns: string[] = ['more', 'product', 'amount', 'quantity'];
  dataSource = new MatTableDataSource<StockItem>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private productService: ProductService) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadStock();
  }

  loadStock() {
    this.productService.getAllProducts().subscribe({
      next: (response) => {
        if (!response?.data) {
          this.dataSource.data = [];
          return;
        }
        
        const tableData: StockItem[] = response.data.map(product => ({
          more: product,
          product: product.productName,
          amount: product.salePrice,
          quantity: product.stockQuantity
        }));
        
        this.dataSource.data = tableData;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.dataSource.data = [];
      }
    });
  }
}