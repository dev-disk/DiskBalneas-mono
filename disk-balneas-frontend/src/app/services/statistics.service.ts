import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IStatisticResponse } from '../interfaces/IStatisticResponse';
import { IServiceResponse } from '../interfaces/IServiceResponse';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
    private apiUrl = `${environment.apiUrl}/statistics`;
  
    constructor(private http: HttpClient) {}
  
    getStatistics(): Observable<IServiceResponse<IStatisticResponse[]>> {
      return this.http.get<IServiceResponse<IStatisticResponse[]>>(this.apiUrl);
    }
}
