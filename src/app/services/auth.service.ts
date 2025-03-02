import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5000/api/auth'; // Backend API
  private jwtHelper = new JwtHelperService();
  private authStatus = new BehaviorSubject<boolean>(this.hasValidToken());

  constructor(private http: HttpClient) {}

  // 📌 Login
  login(email: string, password: string): Observable<any> {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('access_token', response.accessToken);
          this.authStatus.next(true);
        })
      );
  }

  // 📌 Get Access Token
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // 📌 Check if Token is Expired
  isTokenExpired(): boolean {
    const token = this.getToken();
    return token ? this.jwtHelper.isTokenExpired(token) : true;
  }

  // 📌 Refresh Token (Automatically Uses HTTP-Only Cookie)
  refreshToken(): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/refresh`, {});
  }

  // 📌 Logout (Clears Token & Calls Backend Logout)
  logout(): void {
    localStorage.removeItem('access_token');
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe(() => {
      this.authStatus.next(false);
    });
  }

  // 📌 Check if User is Authenticated
  isAuthenticated(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  // 📌 Helper: Check if Token is Valid
  private hasValidToken(): boolean {
    const token = this.getToken();
  
    // Check if the token is null, empty, or incorrectly formatted
    if (!token || token.split('.').length !== 3) {
      return false; // Invalid token
    }
  
    return !this.jwtHelper.isTokenExpired(token);
  }
  

  // 📌 Register (Signup)
register(name: string, email: string, password: string): Observable<any> {
  return this.http.post<{ accessToken: string }>(`${this.apiUrl}/register`, {
    name,
    email,
    password
  }).pipe(
    tap(response => {
      localStorage.setItem('access_token', response.accessToken);
      this.authStatus.next(true);
    })
  );
}

}
