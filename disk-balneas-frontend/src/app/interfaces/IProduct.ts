import { Category } from "../enums/Category";
import { UnitMeasure } from "../enums/UnitMeasure";

export interface IProduct {
  category: Category,
  productName: string,
  salePrice: number,
  costPrice: number,
  stockQuantity: number,
  unitMeasure?: UnitMeasure
}

export interface IProductResponse extends IProduct {
  id: number,
}