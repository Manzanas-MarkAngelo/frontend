import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';

@Injectable()
export class DepartmentService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getDepartments(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fetch_departments.php`);
  }

  getDepartmentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/update_department.php?id=${id}`);
  }

  updateDepartment(id: number, departmentData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update_department.php`, { id, ...departmentData });
  }
}