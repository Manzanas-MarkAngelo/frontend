import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';

@Injectable()
export class ReportsService {

  private apiUrl = `${environment.apiUrl}/fetch_materials.php`;

  constructor(private http: HttpClient) { }

getMaterials(category: string = '', limit: number = 100000): Observable<any> {
  let url = `${this.apiUrl}?limit=${limit}`;
  if (category && category !== 'All') {
    url += `&category=${encodeURIComponent(category)}`;
  }
  return this.http.get<any>(url);
}

}