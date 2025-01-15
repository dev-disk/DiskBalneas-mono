import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '../../../services/product.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { IProduct } from '../../../interfaces/IProduct';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-sale-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatListModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-sale-dialog.component.html',
  styleUrl: './add-sale-dialog.component.css',
})
export class AddSaleDialogComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly cdr = inject(ChangeDetectorRef);

  myControl = new FormControl<string | IProduct>('');
  options: IProduct[] = [];
  filteredOptions: Observable<IProduct[]> = new Observable<IProduct[]>();

  ngOnInit(): void {
    this.loadProducts();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.productName;
        return name ? this._filter(name as string) : this.options.slice();
      })
    );
  }

  private _filter(name: string): IProduct[] {
    const filterValue = name.toLowerCase();
    return this.options.filter((option) =>
      option.productName.toLowerCase().includes(filterValue)
    );
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.options = products;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
      },
    });
  }

  displayFn(product: IProduct): string {
    return product?.productName ?? '';
  }

  selectedProducts: Array<{
    product: IProduct;
    quantity: number;
    totalPrice: number;
  }> = [];

  onOptionSelected(event: any) {
    const selectedProduct = event.option.value as IProduct;

    // Adiciona o produto com quantidade inicial 1
    this.selectedProducts.push({
      product: selectedProduct,
      quantity: 1,
      totalPrice: selectedProduct.salePrice,
    });

    // Limpa o input após a seleção
    this.myControl.setValue('');
    this.cdr.markForCheck();
  }

  removeProduct(index: number) {
    this.selectedProducts.splice(index, 1);
    this.cdr.markForCheck();
  }

  updateQuantity(index: number, change: number) {
    const item = this.selectedProducts[index];
    const newQuantity = item.quantity + change;

    if (newQuantity > 0) {
      item.quantity = newQuantity;
      item.totalPrice = item.product.salePrice * newQuantity;
      this.cdr.markForCheck();
    }
  }

  // Adicione dentro da classe AddSaleDialogComponent
  getTotalQuantity(): number {
    return this.selectedProducts.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  getTotalPrice(): number {
    return this.selectedProducts.reduce(
      (total, item) => total + item.totalPrice,
      0
    );
  }
}
