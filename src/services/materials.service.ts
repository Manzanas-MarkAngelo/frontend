import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';

@Injectable()
export class MaterialsService {
  private apiUrl = `${environment.apiUrl}/fetch_materials.php`; 

  constructor(private http: HttpClient) {}

  getMaterials(page: number, limit: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }

  searchMaterials(term: string, page: number, limit: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?search=${term}&page=${page}&limit=${limit}`);
  }
}
