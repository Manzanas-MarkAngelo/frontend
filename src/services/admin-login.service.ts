import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';

@Injectable()
export class AdminLoginService {
  private apiUrl = `${environment.apiUrl}/admin_login.php`;

  constructor(private http: HttpClient) { }

  // Login API call
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password });
  }

  // Set the user role in localStorage after a successful login
  setSession(role: string): void {
    localStorage.setItem('role', role);
  }

  // Check if the user is logged in by verifying if the role exists
  isLoggedIn(): boolean {
    return !!localStorage.getItem('role');
  }

  // Get the current user role from localStorage
  getRole(): string | null {
    return localStorage.getItem('role'); 
  }

  // Logout the user and clear the session
  logout(): void {
    localStorage.removeItem('role');
  }

  // Check if the current user has an admin role
  isAdmin(): boolean {
    return this.getRole() === 'admin'; 
  }

  // Check if the current user has a librarian role
  isLibrarian(): boolean {
    return this.getRole() === 'librarian';
  }
}
