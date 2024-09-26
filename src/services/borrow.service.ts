import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';

@Injectable()
export class BorrowService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // Add the missing borrowBook method
  borrowBook(idNumber: string, materialId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/borrow_book.php`, {
      id_number: idNumber,
      material_id: materialId
    });
  }

  getBorrowedMaterials(page: number, limit: number, sortField?: string, sortOrder?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortField', sortField || 'date_borrowed') // Default sortField set to 'date_borrowed'
      .set('sortOrder', sortOrder || 'DESC'); // Default sortOrder set to 'DESC'

    console.log('getBorrowedMaterials payload:', params.toString());
    return this.http.get<any>(`${this.apiUrl}/fetch_borrowable_materials.php`, { params });
  }

  searchBorrowedMaterials(term: string, page: number, limit: number, sortField?: string, sortOrder?: string): Observable<any> {
    let params = new HttpParams()
      .set('search', term)
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortField', sortField || 'date_borrowed')
      .set('sortOrder', sortOrder || 'DESC');

    console.log('searchBorrowedMaterials payload:', params.toString());
    return this.http.get<any>(`${this.apiUrl}/fetch_borrowable_materials.php`, { params });
  }

  filterBorrowedMaterialsByCategory(category: string, page: number, limit: number, sortField?: string, sortOrder?: string): Observable<any> {
    let params = new HttpParams()
      .set('category', category)
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortField', sortField || 'date_borrowed')
      .set('sortOrder', sortOrder || 'DESC');

    console.log('filterBorrowedMaterialsByCategory payload:', params.toString());
    return this.http.get<any>(`${this.apiUrl}/fetch_borrowable_materials.php`, { params });
  }

  searchBorrowedMaterialsByCategory(term: string, category: string, page: number, limit: number, sortField?: string, sortOrder?: string): Observable<any> {
    let params = new HttpParams()
      .set('search', term)
      .set('category', category)
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortField', sortField || 'date_borrowed')
      .set('sortOrder', sortOrder || 'DESC');

    console.log('searchBorrowedMaterialsByCategory payload:', params.toString());
    return this.http.get<any>(`${this.apiUrl}/fetch_borrowable_materials.php`, { params });
  }

  getBorrowedMaterialDetails(borrow_id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fetch_borrowed_material_details.php?borrow_id=${borrow_id}`);
  }

  updateBorrowedMaterial(borrowedMaterial: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update_borrowed_material.php`, borrowedMaterial);
  }

  deleteBorrowedMaterial(borrow_id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete_borrowed_material.php`, { borrow_id });
  }

  getCategories(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fetch_borrow_categories.php`);
  }
}
