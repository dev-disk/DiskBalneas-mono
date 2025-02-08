import { Category } from "../enums/Category";

export interface IProduct {
  category: Category,
  productName: string,
  salePrice: number,
  costPrice: number,
  stockQuantity: number,
  unitMeasure?: string
}

export interface IProductResponse extends IProduct {
  id: number,
}