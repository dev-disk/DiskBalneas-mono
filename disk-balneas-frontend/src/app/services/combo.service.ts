import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IServiceResponse } from '../interfaces/IServiceResponse';
import { ICombo, IComboResponse } from '../interfaces/ICombo';

@Injectable({
  providedIn: 'root',
})
export class ComboService {
  private apiUrl = `${environment.apiUrl}/combos`;

  constructor(private http: HttpClient) {}

  getAllCombos(): Observable<IServiceResponse<ICombo[]>> {
    return this.http.get<IServiceResponse<ICombo[]>>(this.apiUrl);
  }

  addCombo(combo: ICombo): Observable<IServiceResponse<IComboResponse>> {
    return this.http.post<IServiceResponse<IComboResponse>>(this.apiUrl, combo);
  }
}
