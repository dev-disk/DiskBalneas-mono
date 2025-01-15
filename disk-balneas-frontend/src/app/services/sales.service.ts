import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISale } from '../interfaces/ISale';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = `${environment.apiUrl}/sales`;

  constructor(private http: HttpClient) { }

  getAllSales(): Observable<ISale[]> {
    return this.http.get<ISale[]>(this.apiUrl);
  }

}
