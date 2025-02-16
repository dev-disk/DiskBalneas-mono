import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { ProductService } from '../../services/product.service';
import { Category } from '../../enums/Category';
import { ComboService } from '../../services/combo.service';
import { ICombo, IComboResponse } from '../../interfaces/ICombo';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IServiceResponse } from '../../interfaces/IServiceResponse';
import { IProductResponse } from '../../interfaces/IProduct';
import { UnitMeasure } from '../../enums/UnitMeasure';

@Component({
  selector: 'app-combo-dialog',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatListModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './combo-dialog.component.html',
  styleUrl: './combo-dialog.component.css',
})
export class ComboDialogComponent implements OnInit {
  iceProducts: IProductResponse[] = [];
  drinkProducts: IProductResponse[] = [];
  energyDrinksProducts: IProductResponse[] = [];

  selectedIce: string = '';
  selectedDrink: string = '';
  selectedEnergyDrink: string = '';
  comboName: string = '';
  comboPrice: number = 0;
  dosePrice: number = 0;
  doseQuantity: number = 1;

  constructor(
    private productService: ProductService,
    private comboService: ComboService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ComboDialogComponent> 
  ) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((response) => {
      const produtos = response.data.map((p) => ({
        ...p,
        category: Category[p.category as unknown as keyof typeof Category],
        unitMeasure: UnitMeasure[p.unitMeasure as unknown as keyof typeof UnitMeasure]
      }));

      this.iceProducts = produtos.filter((p) => p.category === Category.GELO);
      this.drinkProducts = produtos.filter(
        (p) => (p.category === Category.WHISKY || p.category === Category.VODKA) && p.unitMeasure === UnitMeasure.DOSE
      );
      this.energyDrinksProducts = produtos.filter(
        (p) => p.category === Category.ENERGETICO && p.unitMeasure === UnitMeasure.DOSE
      );
    });
  }

  handleQuantityChange(value: number) {
    this.doseQuantity = value < 1 ? 1 : value;
    this.updateComboPrice();
  }

  updateComboPrice() {
    const ice = this.iceProducts.find((p) => p.id === Number(this.selectedIce));
    const drink = this.drinkProducts.find((p) => p.id === Number(this.selectedDrink));
    const energyDrink = this.energyDrinksProducts.find((p) => p.id === Number(this.selectedEnergyDrink));
    
    const iceCost = ice?.salePrice || 0;
    const energyCost = energyDrink?.salePrice || 0;
    const drinkCostPerDose = drink?.salePrice || 0;
    this.dosePrice = drinkCostPerDose;
  
    const baseComboCost = iceCost + energyCost + drinkCostPerDose;
    
    const additionalDosesCost = drinkCostPerDose * Math.max(0, this.doseQuantity - 1);
  
    const baseComboWithProfit = baseComboCost * 1.846;
    const additionalDosesWithProfit = additionalDosesCost * 1.428;
  
    const totalComboPrice = baseComboWithProfit + additionalDosesWithProfit;
  
    this.comboPrice = parseFloat(totalComboPrice.toFixed(4));
  }

  createCombo() {
    const combo: ICombo = {
      comboName: this.comboName,
      iceId: Number(this.selectedIce),
      drinkId: Number(this.selectedDrink),
      energyDrinkId: Number(this.selectedEnergyDrink),
      doseQuantity: this.doseQuantity
    };
  
    this.comboService.addCombo(combo).subscribe({
      next: (response: IServiceResponse<IComboResponse>) => {
        this.snackBar.open('Combo adicionado com sucesso!', 'Fechar', {
          duration: 3000,
        });
        console.log('Combo criado com sucesso:', response);
        this.dialogRef.close({ success: true, combo: response.data });
      },
      error: (err) => {
        this.snackBar.open(
          'Erro ao adicionar combo. Tente novamente.',
          'Fechar',
          { duration: 3000 }
        );
        console.error('Erro ao criar combo:', err);
        this.dialogRef.close({ success: false });
      },
    });
  }
}
