import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISale } from '../interfaces/ISale';
import { environment } from '../../environments/environment';
import { IServiceResponse } from '../interfaces/IServiceResponse';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private apiUrl = `${environment.apiUrl}/sales`;

  constructor(private http: HttpClient) {}

  getAllSales(): Observable<IServiceResponse<ISale[]>> {
    return this.http.get<IServiceResponse<ISale[]>>(this.apiUrl);
  }

  createSale(productIds: number[], quantities: number[]): Observable<any> {
    const payload = {
      productIds,
      quantities,
    };
    return this.http.post<any>(this.apiUrl, payload);
  }
}
