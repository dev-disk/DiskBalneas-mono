import { Category } from "../enums/Category";

export interface IProduct {
  id?: string,
  category: Category,
  productName: string,
  salePrice: number,
  stockQuantity: number,
  unitMeasure: string
}