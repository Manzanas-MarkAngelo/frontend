import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';

@Injectable()
export class BorrowService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getBorrowableMaterials(page: number, limit: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fetch_borrowable_materials.php?page=${page}&limit=${limit}`);
  }

  searchBorrowableMaterials(term: string, page: number, limit: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fetch_borrowable_materials.php?search=${term}&page=${page}&limit=${limit}`);
  }

  filterBorrowableMaterialsByCategory(category: string, page: number, limit: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fetch_borrowable_materials.php?category=${category}&page=${page}&limit=${limit}`);
  }

  searchBorrowableMaterialsByCategory(term: string, category: string, page: number, limit: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fetch_borrowable_materials.php?search=${term}&category=${category}&page=${page}&limit=${limit}`);
  }

  borrowBook(idNumber: string, materialId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/borrow_book.php`, {
      id_number: idNumber,
      material_id: materialId
    });
  }
}