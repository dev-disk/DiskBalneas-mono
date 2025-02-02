import { IProduct } from "./IProduct"

export interface ISale {
  date: string,
  products: IProduct[],
  quantities: number[],
  subtotal: number
}