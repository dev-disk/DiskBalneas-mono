import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { IProduct, IProductResponse } from '../../interfaces/IProduct';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-edit-product-dialog',
  templateUrl: 'edit-product-dialog.component.html',
  styleUrl: 'edit-product-dialog.component.css',
  standalone: true,
  imports: [
    MatButtonModule, 
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule
  ]
})
export class EditProductDialogComponent {
  editForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IProductResponse,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {
    this.editForm = new FormGroup({
      productName: new FormControl(data.productName),
      category: new FormControl(data.category),
      salePrice: new FormControl(data.salePrice, Validators.min(0)),
      costPrice: new FormControl(data.costPrice, Validators.min(0)),
      stockQuantity: new FormControl(data.stockQuantity, Validators.min(0))
    });
  }

  onSave(): void {
    const formValue = this.editForm.value;
    const updateProducts: IProduct = {
      productName:  formValue.productName,
      category: formValue.category,
      costPrice: formValue.costPrice,
      salePrice: formValue.salePrice,
      stockQuantity: formValue.stockQuantity
    }
    if (this.editForm.valid) {
      const updatedProduct: IProduct = {
        ...this.editForm.value,
        category: Number(this.editForm.value.category),
        id: this.data.id
      };
      this.dialogRef.close(updatedProduct);
    }

    this.productService.updateProduct(this.data.id, updateProducts).subscribe({
      next: (response) => {
        console.log('Produto atualizado com sucesso', response);
        this.dialogRef.close(true);
        this.snackBar.open(
          'Produto Atualizado com sucesso!', 'Fechar', {
            duration: 3000,
          }
        )
      },
      error: (error) => {
        console.error('Falha na atualização do produto', error);
        this.snackBar.open(
          'Falha em editar o produto.', 'Fechar', {
            duration: 3000,
          }
        )
      }
    });
  }
}