import { IProduct } from "./IProduct"

export interface ISale {
  id: string,
  data: string,
  products: IProduct[],
  quantity: number,
  subtotal: number
}