import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { ISale, ISaleResponse } from '../../../interfaces/ISale';
import { MatButtonModule } from '@angular/material/button';

interface GroupedItem {
  productName: string;
  quantity: number;
}

@Component({
  selector: 'app-sale-dialog',
  imports: [
    MatDialogModule,
    MatListModule,
    MatButtonModule
  ],
  templateUrl: './sale-dialog.component.html',
  styleUrl: './sale-dialog.component.css'
})
export class SaleDialogComponent {
  groupedItems: GroupedItem[] = [];


  constructor(
    public dialogRef: MatDialogRef<SaleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public sale: ISaleResponse
  ) {
    this.groupItems();
  }

  private groupItems() {
    const itemsMap = new Map<string, number>();

    // Agrupa os itens pelo nome do produto
    this.sale.products.forEach((product, index) => {
      const quantity = this.sale.quantities[index];
      if (itemsMap.has(product.productName)) {
        itemsMap.set(product.productName, itemsMap.get(product.productName)! + quantity);
      } else {
        itemsMap.set(product.productName, quantity);
      }
    });

    // Converte o Map para um array de GroupedItem
    this.groupedItems = Array.from(itemsMap.entries()).map(([productName, quantity]) => ({
      productName,
      quantity
    }));
  }
}
