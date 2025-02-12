import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    MatSelectModule,
    MatRadioModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './confirm-payment-dialog.component.html',
  styleUrl: './confirm-payment-dialog.component.css'

})


export class ConfirmPaymentDialogComponent {

  form: FormGroup;
  selectedPayment: FormControl;
  private readonly cdr = inject(ChangeDetectorRef);

  constructor(
    private dialogRef: MatDialogRef<AddSaleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public products: ProductData,
    private salesService: SalesService,
    private snackBar: MatSnackBar
  ) {
    this.selectedPayment = new FormControl();
    this.form = new FormGroup({
      payment: this.selectedPayment
    });
  }


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
      payment: this.selectedPayment.value,
      queroDelivery: queroDelivery

    }

    this.salesService.createSale(sale).subscribe({
      next: (response) => {
        this.dialogRef.close({
          success: true,
          sale: response,
        });
        this.snackBar.open('Venda realizada com sucesso!', 'Fechar', {
          duration: 3000,
        });
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Erro ao criar venda:', error);
        this.snackBar.open(
          'Erro ao executar a venda. Tente novamente.', 'Fechar', {
            duration: 3000,
          }
        );
        this.cdr.markForCheck();
      },
    });
  }
}
