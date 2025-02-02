import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { MatTableModule, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { SaleDialogComponent } from '../../components/sales/sale-dialog/sale-dialog.component';
import { AddSaleDialogComponent } from '../../components/sales/add-sale-dialog/add-sale-dialog.component';
import { Subject, takeUntil } from 'rxjs';
import { SalesService } from '../../services/sales.service';
import { ISale } from '../../interfaces/ISale';
import { CommonModule } from '@angular/common';
import { ReplacePipe } from '../../helpers/replace.pipe';

interface SalesItem {
  more: ISale;
  date: string;
  hour: string;
  item: string;
  subtotal: number;
}

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ReplacePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<SalesItem>;

  displayedColumns = ['more', 'date', 'hour', 'item', 'subtotal'];
  dataSource = new MatTableDataSource<SalesItem>();
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly salesService: SalesService,
    private readonly cdr: ChangeDetectorRef
  ) {
  }


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadSales();
  }

  readonly dialog = inject(MatDialog);

  openMoreDialog(sale: ISale) {
    const dialogRef = this.dialog.open(SaleDialogComponent, {
      data: sale
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        console.log(`Dialog result: ${result}`);
      });
  }

  private readonly DIALOG_CONFIG = {
    ADD_SALE: {
      width: '1300px',
      maxWidth: '90vw',
      height: '80vh',
      maxHeight: '90vh',
    },
    SALE_DETAILS: {
      width: '800px',
    },
  } as const;

  private formatProductsDisplay(sale: ISale): string {
    if (!sale?.products.length) return '0 items';
    
    return sale.products.map((product, index) => {
      return `${sale.quantities[index]} x ${product.productName}`;
    }).join('\n');
  }
  

  loadSales() {
    this.salesService.getAllSales()
      .subscribe({
        next: (response) => {
          if (!response?.data) {
            console.error('No sales data received');
            this.dataSource.data = [];
            return;
          }

          const tableData: SalesItem[] = response.data.map((sale) => {
            const saleDate = new Date(sale.data);

            return {
              more: sale,
              date: saleDate.toLocaleDateString(),
              hour: saleDate.toLocaleTimeString(),
              item: this.formatProductsDisplay(sale),
              subtotal: sale.subtotal,
            };
          });

          this.dataSource.data = tableData;

        },
        error: (error) => {
          console.error('Erro ao carregar vendas:', error);
          this.dataSource.data = [];
        },
      });
  }

  openAddSaleDialog() {
    const dialogRef = this.dialog.open(
      AddSaleDialogComponent,
      this.DIALOG_CONFIG.ADD_SALE
    );

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result?.success) {
          this.loadSales();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
