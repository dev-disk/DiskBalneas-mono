import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IProduct, IProductResponse } from '../../interfaces/IProduct';
import { ProductService } from '../../services/product.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { EditProductDialogComponent } from '../edit-product-dialog/edit-product-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-stock-dialog',
  templateUrl: './stock-dialog.component.html',
  styleUrls: ['./stock-dialog.component.css'],
  standalone: true,
  imports: [
    MatListModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule
  ]
})
export class StockDialogComponent {
  product: IProductResponse;

  constructor(
    public dialogRef: MatDialogRef<StockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IProductResponse,
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.product = data;
  }

  onDelete(): void {
    const confirmDialog = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '250px',
      data: { productName: this.product.productName }
    });

    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(this.product.id).subscribe({
          next: () => {
            this.dialogRef.close(true);
            this.snackBar.open('Produto Excluído com sucesso!', 'Fechar', {
              duration: 3000,
            });
          },
          error: (error) => {
            console.error('Delete failed', error);
            this.snackBar.open(
              'Erro ao Deletar produto.', 'Fechar', {
                duration: 3000,
              }
            )
          }
        });
      }
    });
  }

  onEdit(): void {
    const editDialog = this.dialog.open(EditProductDialogComponent, {
      width: '400px',
      data: this.product
    });
  
    editDialog.afterClosed().subscribe(result => {
      if (result) {
        const updatedProduct: IProduct = {
          productName: result.productName,
          category: result.category,
          salePrice: result.salePrice,
          costPrice: result.costPrice,
          stockQuantity: result.stockQuantity
        };
      }
    });
  }
}

@Component({
  selector: 'app-confirm-delete-dialog',
  template: `
    <h2 mat-dialog-title>Confirmar Exclusão</h2>
    <mat-dialog-content>
      Tem certeza que deseja excluir o produto "{{ data.productName }}"?
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="dialogRef.close(false)">Cancelar</button>
      <button mat-button (click)="dialogRef.close(true)">Excluir</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule]
})
export class ConfirmDeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { productName: string }
  ) {}
}
