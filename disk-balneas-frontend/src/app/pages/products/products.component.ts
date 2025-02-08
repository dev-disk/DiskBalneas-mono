import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../services/product.service';
import { Category } from '../../enums/Category';
import { UnitMeasure } from '../../enums/UnitMeasure';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTabsModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  productForm!: FormGroup;
  salePrice: string = '';
  costPrice: string = '';

  categoryArray = Object.entries(Category)
    .filter(([key]) => isNaN(Number(key)))
    .map(([key, value]) => ({
      key: key,
      value: value,
      label: this.formatEnumLabel(key),
    }));

  unitMeasureArray = Object.entries(UnitMeasure)
    .filter(([key]) => isNaN(Number(key)))
    .map(([key, value]) => ({
      key: key,
      value: value,
      label: this.formatEnumLabel(key),
    }));

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {
    this.initializeForm();
  }

  private formatEnumLabel(key: string): string {
    return key
      .replace(/_/g, ' ')
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private initializeForm(): void {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required]],
      salePrice: ['', [Validators.required]],
      costPrice: ['', [Validators.required]],
      stockQuantity: ['', [Validators.required, Validators.min(0)]],
      unitMeasure: ['', [Validators.required]],
      category: [''],
    });
  }

  formatCurrency(value: string): string {
    if (!value) return '';
    const numValue = parseFloat(value.replace(/[^0-9]/g, '')) / 100;
    return numValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    });
  }

  updateCurrency(event: any, field: 'salePrice' | 'costPrice'): void {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    const formattedValue = this.formatCurrency(numericValue);
    
    this[field] = numericValue;
    this.productForm.get(field)?.setValue(numericValue, { emitEvent: false });
    event.target.value = formattedValue;
  }

  private resetForm(): void {
    this.salePrice = '';
    this.costPrice = '';
    
    const emptyForm = {
      productName: '',
      salePrice: '',
      costPrice: '',
      stockQuantity: '',
      unitMeasure: '',
      category: '',
    };

    this.productForm.reset(emptyForm, { emitEvent: false });
    
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      if (control) {
        control.setErrors(null);
        control.markAsUntouched();
        control.markAsPristine();
      }
    });
  }

  addProduct(): void {
    if (this.productForm.invalid) {
      this.snackBar.open(
        'Por favor, preencha todos os campos obrigatórios',
        'Fechar',
        { duration: 3000 }
      );
      return;
    }

    const formValue = this.productForm.value;
    const product = {
      productName: formValue.productName,
      salePrice: parseFloat(formValue.salePrice) / 100,
      costPrice: parseFloat(formValue.costPrice) / 100,
      stockQuantity: parseFloat(formValue.stockQuantity),
      unitMeasure: formValue.unitMeasure,
      category: formValue.category,
    };

    this.productService.addProduct(product).subscribe({
      next: () => {
        this.snackBar.open('Produto adicionado com sucesso!', 'Fechar', {
          duration: 3000,
        });
        this.resetForm();
      },
      error: (error) => {
        this.snackBar.open(
          'Erro ao adicionar produto. Tente novamente.',
          'Fechar',
          { duration: 3000 }
        );
        console.error('Erro ao adicionar produto:', error);
      },
    });
  }
}