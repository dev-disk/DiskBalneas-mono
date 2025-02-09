import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISale } from '../interfaces/ISale';
import { environment } from '../../environments/environment';
import { IServiceResponse } from '../interfaces/IServiceResponse';
import { Payment } from '../enums/Payment';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private apiUrl = `${environment.apiUrl}/sales`;

  constructor(private http: HttpClient) {}

  getAllSales(): Observable<IServiceResponse<ISale[]>> {
    return this.http.get<IServiceResponse<ISale[]>>(this.apiUrl);
  }

  createSale(sale: ISale): Observable<any> {
      
    return this.http.post<ISale>(this.apiUrl, sale);
  }
}
