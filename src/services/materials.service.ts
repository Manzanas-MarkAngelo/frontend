import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialsService {
  private apiUrl = 'http://localhost/controller_lis/fetch_materials.php';

  constructor(private http: HttpClient) {}

  getMaterials(page: number, limit: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }

  searchMaterials(term: string, page: number, limit: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?search=${term}&page=${page}&limit=${limit}`);
  }
}
