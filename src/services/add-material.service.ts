import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';

@Injectable()
export class AddMaterialService {

  private addCategoryUrl = `${environment.apiUrl}/add_material_type.php`;
  private addBookUrl = `${environment.apiUrl}/add_material.php`;
  private getAccessionNumberUrl = `${environment.apiUrl}/fetch_accession_no.php`;
  private getSubjectHeadingsUrl = `${environment.apiUrl}/fetch_subjects.php`;

  constructor(private http: HttpClient) { }

  // Method to add a category
  addCategory(categoryDetails: any): Observable<any> {
    return this.http.post<any>(this.addCategoryUrl, categoryDetails);
  }

  // Method to get accession number by category ID
  getAccessionNumber(cat_id: number): Observable<any> {
    return this.http.get<any>(`${this.getAccessionNumberUrl}?cat_id=${cat_id}`);
  }

  // Method to add a book
  addBook(bookDetails: any): Observable<any> {
    return this.http.post<any>(this.addBookUrl, bookDetails);
  }
    // Method to get subject headings
    getSubjectHeadings(): Observable<any> {
      return this.http.get<any>(this.getSubjectHeadingsUrl);
    }
}
