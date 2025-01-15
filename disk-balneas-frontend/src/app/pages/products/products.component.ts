import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule, CurrencyPipe } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';

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
    MatTabsModule
  ],
  providers: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  salePrice: string = '';
  costPrice: string = '';
  activeTab: string = 'produtos';

  // Formata o valor para moeda
  formatCurrency(value: string): string {
    if (!value) return '';
    const numValue = parseFloat(value.replace(/[^0-9]/g, '')) / 100;
    return numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }

  // Atualiza o valor com a formatação
  updateCurrency(event: any, field: 'salePrice' | 'costPrice'): void {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, ''); // Remove caracteres não numéricos
    const formattedValue = this.formatCurrency(numericValue);
    this[field] = numericValue; // Mantém valor limpo
    event.target.value = formattedValue; // Atualiza o valor formatado no input
  }

}
