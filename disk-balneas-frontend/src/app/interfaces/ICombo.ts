export interface ICombo {
  comboName: string,
  iceId: number,
  drinkId: number,
  energyDrinkId: number,
  price?: number,
  doseQuantity: number
}

export interface IComboResponse extends ICombo {
  id: number,
}