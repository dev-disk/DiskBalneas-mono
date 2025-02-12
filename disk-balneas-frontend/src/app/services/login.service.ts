import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IServiceResponse } from '../interfaces/IServiceResponse';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = `${environment.apiUrl}/auth/login`;

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) {}

  login(login: string, password: string): Observable<IServiceResponse<string>> {
    const body = {
      login: login,
      password: password,
    };

    return this.http.post<any>(this.apiUrl, body).pipe(
      tap((response) => {
        this.setToken(response.data);
      })
    );
  }

  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}
