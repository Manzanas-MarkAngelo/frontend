import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';

@Injectable()
export class SuperAdminService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getSuperAdminById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fetch_super_admin.php?id=${id}`);
  }

  updateSuperAdmin(id: number, adminData: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/update_super_admin.php`, { id, ...adminData }
    );
  }
}