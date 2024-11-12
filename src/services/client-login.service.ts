import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClientLoginService {
  private clientaccessKey: string = 'clientaccess'; // Key to store in localStorage

  constructor(private router: Router) {
    // Initialize clientaccess from localStorage if available, otherwise set to false
    const storedAccess = localStorage.getItem(this.clientaccessKey);
    if (storedAccess) {
      this.clientaccess = JSON.parse(storedAccess); // Parse stored value to boolean
    } else {
      this.clientaccess = false; // Default to false if no value is found
    }
  }

  private clientaccess: boolean = false; // Initial value set to false

  setClientAccess(access: boolean): void {
    this.clientaccess = access;
    // Save the value to localStorage to persist across page refreshes
    localStorage.setItem(this.clientaccessKey, JSON.stringify(this.clientaccess));
  }

  getClientAccess(): boolean {
    return this.clientaccess;
  }

  canActivate(): boolean {
    if (this.clientaccess) {
      return true; // Allow access if clientaccess is true
    } else {
      this.router.navigate(['/login-lispupt']); // Redirect to login if access is false
      return false;
    }
  }
}
