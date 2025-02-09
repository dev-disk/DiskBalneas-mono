import { Payment } from "../enums/Payment"
import { IProduct } from "./IProduct"

export interface ISale {
  productIds: number[],
  quantities: number[],
  payment: Payment,
  queroDelivery: boolean,
}

export interface ISaleResponse extends ISale {
  products: IProduct[],
  date: string,
  subtotal: number
}