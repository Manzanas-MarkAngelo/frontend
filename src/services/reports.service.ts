import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class ReportsService {

  private apiUrl = `${environment.apiUrl}/fetch_materials.php`;
  private departmentsApiUrl = `${environment.apiUrl}/fetch_subjects.php`; // Add this line

  constructor(private http: HttpClient) { }

  getMaterials(category: string = '', program: string = '', limit: number = 100000): Observable<any> {
    let url = `${this.apiUrl}?limit=${limit}`;
    if (category && category !== 'All') {
      url += `&category=${encodeURIComponent(category)}`;
    }
    if (program && program !== 'All') {
      url += `&program=${encodeURIComponent(program)}`;
    }
  
    return this.http.get<any>(url);
  }
   

  // New method to fetch departments from the backend
  getDepartments(): Observable<any> {
    return this.http.get<any>(this.departmentsApiUrl);
  }

// Updated method to fetch subjects with an optional categoryid filter
getSubjects(categoryid?: number): Observable<any> {
  let params = new HttpParams();
  
  if (categoryid !== undefined && categoryid !== null) {
    params = params.set('categoryid', categoryid.toString());
  }

  return this.http.get<any>(this.departmentsApiUrl, { params });
}

}
