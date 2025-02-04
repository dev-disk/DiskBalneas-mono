import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduct, IProductResponse } from '../interfaces/IProduct';
import { IServiceResponse } from '../interfaces/IServiceResponse';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<IServiceResponse<IProductResponse[]>> {
    return this.http.get<IServiceResponse<IProductResponse[]>>(this.apiUrl);
  }

  addProduct(product: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(this.apiUrl, product);
  }
  
  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}`);
  }  

  updateProduct(productId: number, updateProduct: IProduct): Observable<IProductResponse> {
    return this.http.put<IProductResponse>(`${this.apiUrl}/${productId}`, updateProduct);
  }

}
