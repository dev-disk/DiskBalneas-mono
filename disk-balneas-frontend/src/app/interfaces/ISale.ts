import { IProduct } from "./IProduct"

export interface ISale {
  data: string,
  products: IProduct[],
  quantity: number,
  subtotal: number
}