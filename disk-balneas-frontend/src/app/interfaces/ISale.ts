import { IProduct } from "./IProduct"

export interface ISale {
  data: string,
  products: IProduct[],
  quantities: number[],
  subtotal: number
}