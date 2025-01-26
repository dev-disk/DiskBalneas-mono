export interface ICombo {
  comboName: string,
  iceId: number,
  drinkId: number,
  energyDrinkId: number,
}

export interface IComboResponse extends ICombo {
  id: number,
  price: number
}