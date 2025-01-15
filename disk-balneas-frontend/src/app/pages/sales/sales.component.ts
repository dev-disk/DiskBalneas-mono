import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { SalesDataSource, SalesItem } from './sales-datasource';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
} from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { SaleDialogComponent } from '../../components/sales/sale-dialog/sale-dialog.component';
import { AddSaleDialogComponent } from '../../components/sales/add-sale-dialog/add-sale-dialog.component';
import { ICONS } from '../../../assets/icons';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<SalesItem>;
  dataSource = new SalesDataSource();

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly iconRegistry: MatIconRegistry,
    private readonly sanitizer: DomSanitizer
  ) {
    this.registerIcons();
  }

  private registerIcons(): void {
    this.iconRegistry.addSvgIconLiteral(
      'more-horiz',
      this.sanitizer.bypassSecurityTrustHtml(ICONS.MORE_ICON)
    );
  }

  displayedColumns = ['more', 'date', 'hour', 'item', 'subtotal'];

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  readonly dialog = inject(MatDialog);
  openMoreDialog() {
    const dialogRef = this.dialog.open(SaleDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
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

  openAddSaleDialog() {
    const dialogRef = this.dialog.open(
      AddSaleDialogComponent,
      this.DIALOG_CONFIG.ADD_SALE
    );

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
