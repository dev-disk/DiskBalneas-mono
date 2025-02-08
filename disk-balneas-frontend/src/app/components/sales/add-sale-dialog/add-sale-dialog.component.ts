import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ProductService } from '../../../services/product.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { IProduct, IProductResponse } from '../../../interfaces/IProduct';
import { AsyncPipe   } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { SalesService } from '../../../services/sales.service';
import { ComboDialogComponent } from '../../combo-dialog/combo-dialog.component';
import { IComboResponse } from '../../../interfaces/ICombo';
import { Category } from '../../../enums/Category';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { UnitMeasure } from '../../../enums/UnitMeasure';


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
    MatCheckboxModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-sale-dialog.component.html',
  styleUrl: './add-sale-dialog.component.css',
})
export class AddSaleDialogComponent implements OnInit, OnDestroy {
  private readonly productService = inject(ProductService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();
  readonly dialog = inject(MatDialog);
  isDeliveryChecked = false;


  constructor(
    private dialogRef: MatDialogRef<AddSaleDialogComponent>,
    private salesService: SalesService
  ) {}

  myControl = new FormControl<string | IProduct>('');
  options: IProductResponse[] = [];
  filteredOptions: Observable<IProduct[]> = new Observable<IProduct[]>();

  ngOnInit(): void {
    this.loadProducts();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(null),
      map((value) => {
        const filtered = this.options.filter(
          (option) =>
            option.unitMeasure !== UnitMeasure.DOSE &&
             !this.selectedProducts.some((item) => item.product.id === option.id)
        );

        if (value === null) {
          return filtered;
        }        
        const name = typeof value === 'string' ? value : value?.productName;
        return name ? this._filter(name, filtered) : filtered;
      })
    );
  }

  private _filter(name: string, availableOptions: IProductResponse[]): IProductResponse[] {
    const filterValue = name.toLowerCase();
    return availableOptions.filter((option) =>
      option.productName.toLowerCase().includes(filterValue)
    );
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.options = products.data;
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
    product: IProductResponse;
    quantity: number;
    totalPrice: number;
  }> = [];

  onOptionSelected(event: any) {
    const selectedProduct = event.option.value as IProductResponse;

    this.selectedProducts.push({
      product: selectedProduct,
      quantity: 1,
      totalPrice: selectedProduct.salePrice,
    });

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

  getTotalQuantity(): number {
    return this.selectedProducts.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  getTotalPrice(): number {
    let total = this.selectedProducts.reduce(
      (total, item) => total + item.totalPrice,
      0
    );

    if (this.isDeliveryChecked) {
      total = total + (total * 0.099)
    }
  
    return total;
  }

  submitSale() {
    if (this.selectedProducts.length === 0) return;

    const productIds = this.selectedProducts.map((item) => item.product.id!);
    const quantities = this.selectedProducts.map((item) => item.quantity);

    this.salesService.createSale(productIds, quantities, this.isDeliveryChecked).subscribe({
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

  openAddComboDialog() {
    const dialogRef = this.dialog.open(ComboDialogComponent);

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: { success: boolean; combo: IComboResponse }) => {
        if (result?.success && result.combo) {
          const combo: IComboResponse = result.combo;
          console.log("Aqui", combo)
          const comboProduct = {
            product: <IProductResponse> {
              id: combo.id,
              productName: combo.comboName,
              salePrice: combo.price!,
              category: Category.SEM_CATEGORIA,
              stockQuantity: 20,
              unitMeasure: UnitMeasure.UNIDADE
            },
            quantity: 1,
            totalPrice: combo.price!,
          };

          console.log(comboProduct)

          this.selectedProducts.push(comboProduct);
          this.cdr.markForCheck();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
