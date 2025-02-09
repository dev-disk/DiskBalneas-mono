import { Component, Inject, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { IProductResponse } from '../../../interfaces/IProduct';
import { ProductService } from '../../../services/product.service';
import { SalesService } from '../../../services/sales.service';
import { AddSaleDialogComponent } from '../add-sale-dialog/add-sale-dialog.component';
import { Payment } from '../../../enums/Payment';
import { MatSelectModule } from '@angular/material/select';
import { ISale } from '../../../interfaces/ISale';

interface ProductData {
  productIds: number[];
  quantities: number[];
  totalPrice: number;
  queroDelivery: boolean;
}

@Component({
  selector: 'app-confirm-payment-dialog',
  imports: [
    FormsModule,
    MatDialogModule,
    MatListModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './confirm-payment-dialog.component.html',
  styleUrl: './confirm-payment-dialog.component.css'

})


export class ConfirmPaymentDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<AddSaleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public products: ProductData ,
    private salesService: SalesService
  ) {}

  selectedPayment: Payment | null = null;

  paymentArray = Object.entries(Payment)
      .filter(([key]) => isNaN(Number(key)))
      .map(([key, value]) => ({
        key: key,
        value: Payment[key as keyof typeof Payment],
        label: this.formatEnumLabel(key),
      }));

      private formatEnumLabel(key: string): string {
        return key
          .replace(/_/g, ' ')
          .toLowerCase()
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }

  private readonly productService = inject(ProductService);

  submitSale() {

    const {productIds, quantities, queroDelivery} = this.products;
    const sale: ISale = {
      productIds: productIds,
      quantities: quantities,
      payment: this.selectedPayment!,
      queroDelivery: queroDelivery

    }

    this.salesService.createSale(sale).subscribe({
      next: (response) => {
        this.dialogRef.close({
          success: true,
          sale: response,
        });
      },
      error: (error) => {
        console.error('Erro ao criar venda:', error);
      },
    });
  }

}
