import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';

@Injectable()
export class MaterialsService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getMaterials(page: number, limit: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fetch_materials.php?page=${page}&limit=${limit}`);
  }

  searchMaterials(term: string, page: number, limit: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fetch_materials.php?search=${term}&page=${page}&limit=${limit}`);
  }

  filterMaterialsByCategory(category: string, page: number, limit: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fetch_materials.php?category=${category}&page=${page}&limit=${limit}`);
  }

  searchMaterialsByCategory(term: string, category: string, page: number, limit: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fetch_materials.php?search=${term}&category=${category}&page=${page}&limit=${limit}`);
  }

  getMaterialDetails(accnum: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fetch_material_details.php?accnum=${accnum}`);
  }
}
