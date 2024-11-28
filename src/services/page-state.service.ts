import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageStateService {
  // Behavior subjects for different tables
  private materialPageSource = new BehaviorSubject<number>(1);
  private borrowPageSource = new BehaviorSubject<number>(1);
  private materialSuperAdminPageSource = new BehaviorSubject<number>(1);
  private studentsPageSource = new BehaviorSubject<number>(1);
  private facultyPageSource = new BehaviorSubject<number>(1);
  private visitorPageSource = new BehaviorSubject<number>(1);
  private employeePageSource = new BehaviorSubject<number>(1);
  private searchBookPageSource = new BehaviorSubject<number>(1);

  // Observables for external components to subscribe to
  materialPage$ = this.materialPageSource.asObservable();
  borrowPage$ = this.borrowPageSource.asObservable();
  materialSuperAdminPage$ = this.materialSuperAdminPageSource.asObservable();
  studentsPage$ = this.studentsPageSource.asObservable();
  facultyPage$ = this.facultyPageSource.asObservable();
  visitorPage$ = this.visitorPageSource.asObservable();
  employeePage$ = this.employeePageSource.asObservable();
  searchBookPage$ = this.searchBookPageSource.asObservable();

  // Set the current page for a specific table
  setMaterialCurrentPage(page: number, table: string): void {
    switch (table) {
      case 'materials':
        this.materialPageSource.next(page);
        break;
      case 'borrow':
        this.borrowPageSource.next(page);
        break;
      case 'materialsSuperAdmin':
        this.materialSuperAdminPageSource.next(page);
        break;
      case 'students':
        this.studentsPageSource.next(page);
        break;
      case 'faculty':
        this.facultyPageSource.next(page);
        break;
      case 'visitor':
        this.visitorPageSource.next(page);
        break;
      case 'employee':
        this.employeePageSource.next(page);
      case 'searchBook':
        this.searchBookPageSource.next(page);
        break;
        break;
      default:
        console.error(`Unknown table: ${table}`);
    }
  }

  // Get the current page value for a specific table
  getMaterialCurrentPage(table: string): number {
    switch (table) {
      case 'materials':
        return this.materialPageSource.getValue();
      case 'borrow':
        return this.borrowPageSource.getValue();
      case 'materialsSuperAdmin':
        return this.materialSuperAdminPageSource.getValue();
      case 'students':
        return this.studentsPageSource.getValue();
      case 'faculty':
        return this.facultyPageSource.getValue();
      case 'visitor':
        return this.visitorPageSource.getValue();
      case 'employee':
        return this.employeePageSource.getValue();
      case 'searchBook':
        return this.searchBookPageSource.getValue();
      default:
        return 1; // Default value
    }
  }
}
