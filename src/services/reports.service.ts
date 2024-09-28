import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';

@Injectable()
export class ReportsService {

  private apiUrl = `${environment.apiUrl}/fetch_materials.php`;
  private departmentsApiUrl = `${environment.apiUrl}/fetch_departments.php`; // Add this line

  constructor(private http: HttpClient) { }

  getMaterials(category: string = '', program: string = '', limit: number = 100000): Observable<any> {
    // Log the parameters being sent
    console.log('Category:', category);
    console.log('Program:', program);
    console.log('Limit:', limit);
  
    let url = `${this.apiUrl}?limit=${limit}`;
    if (category && category !== 'All') {
      url += `&category=${encodeURIComponent(category)}`;
    }
    if (program && program !== 'All') {
      url += `&program=${encodeURIComponent(program)}`;
    }
  
    // Log the final URL
    console.log('Fetching materials with URL:', url);
  
    return this.http.get<any>(url);
  }
   

  // New method to fetch departments from the backend
  getDepartments(): Observable<any> {
    return this.http.get<any>(this.departmentsApiUrl);
  }
}
