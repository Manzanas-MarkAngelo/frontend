import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';

@Injectable()
export class AddMaterialService {

  private addCategoryUrl = `${environment.apiUrl}/add_material_type.php`;
  private addBookUrl = `${environment.apiUrl}/add_material.php`;

  constructor(private http: HttpClient) { }

  // Method to add a category
  addCategory(categoryDetails: any): Observable<any> {
    return this.http.post<any>(this.addCategoryUrl, categoryDetails);
  }

  // Method to add a book
  addBook(bookDetails: any): Observable<any> {
      // Log the payload
      console.log('updateMaterial payload:', bookDetails);
    return this.http.post<any>(this.addBookUrl, bookDetails);

  }
}
