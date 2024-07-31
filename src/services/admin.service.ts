import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AdminService {
  private roleSource = new BehaviorSubject<string | null>(null);
  currentRole = this.roleSource.asObservable();

  setRole(role: string | null) {
    this.roleSource.next(role);
  }
}