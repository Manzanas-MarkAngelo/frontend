import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AdminService {
  private roleSource: BehaviorSubject<string | null>;
  currentRole: BehaviorSubject<string | null>;

  constructor() {
    const initialRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
    this.roleSource = new BehaviorSubject<string | null>(initialRole);
    this.currentRole = this.roleSource;
  }

  setRole(role: string | null) {
    if (typeof window !== 'undefined') {
      if (role) {
        localStorage.setItem('userRole', role);
      } else {
        localStorage.removeItem('userRole');
      }
    }
    this.roleSource.next(role);
  }
}