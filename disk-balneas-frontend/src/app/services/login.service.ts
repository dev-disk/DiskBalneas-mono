import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = `${environment.apiUrl}/auth/login`;

  constructor(private http: HttpClient) { }

  login(login: string, password: string): Observable<any> {
    const body = { 
      login: login,
      password: password
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.apiUrl, body, { headers });
  }

  armazenarToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  obterToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}
