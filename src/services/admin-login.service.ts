import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';

@Injectable()
export class AdminLoginService {
  private apiUrl = `${environment.apiUrl}/admin_login.php`;
  private clientLoginUrl = `${environment.apiUrl}/client_access.php`;
  private checkEmailUrl = `${environment.apiUrl}/check_email.php`;
  private resetPasswordUrl = `${environment.apiUrl}/reset_password.php`;

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password });
  }

  setSession(role: string): void {
    localStorage.setItem('role', role);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('role');
  }

  getRole(): string | null {
    return localStorage.getItem('role'); 
  }

  logout(): void {
    localStorage.removeItem('role');
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin'; 
  }

  isLibrarian(): boolean {
    return this.getRole() === 'librarian';
  }

  loginClient(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.clientLoginUrl, { username, password });
  }

  checkEmail(email: string): Observable<any> {
    return this.http.post<any>(this.checkEmailUrl, { email });
  }

  resetPassword(password: string, token: string | null): Observable<any> {
    return this.http.post<any>(this.resetPasswordUrl, { password, token });
  }
}