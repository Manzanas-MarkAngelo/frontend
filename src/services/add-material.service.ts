import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';

@Injectable()
export class AddMaterialService {

  private addCategoryUrl = `${environment.apiUrl}/add_material_type.php`;
  private addBookUrl = `${environment.apiUrl}/add_material.php`;
  private getAccessionNumberUrl = `${environment.apiUrl}/fetch_accession_no.php`;
  private getSubjectHeadingsUrl = `${environment.apiUrl}/fetch_subjects.php`;
  private getpPginatedSubjectsUrl = `${environment.apiUrl}/fetch_paginated_subj.php`;
  private getSingleSubjectUrl = `${environment.apiUrl}/fetch_single_subject.php`;
  private updateSubjectUrl = `${environment.apiUrl}/update_subject.php`;

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
  
  // Method to get subject headings, with an optional search term
  getSubjectHeadings(searchTerm: string = ''): Observable<any> {
    const url = searchTerm 
                ? `${this.getSubjectHeadingsUrl}?searchTerm=${encodeURIComponent(searchTerm)}`
                : this.getSubjectHeadingsUrl;
    return this.http.get<any>(url);
  }

  getPaginatedSubjects(page: number, searchTerm: string = ''): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('searchTerm', searchTerm);

    return this.http.get<any>(this.getpPginatedSubjectsUrl, { params });
  }

  deleteSubject(subjectId: number): Observable<any> {
    const deleteUrl = `${environment.apiUrl}/delete_subject.php?id=${subjectId}`;
    console.log('Payload for deleteSubject:', { url: deleteUrl, subjectId });

    return this.http.delete<any>(deleteUrl);
  }

  getSubjectById(subjectId: number): Observable<any> {
    const url = `${this.getSingleSubjectUrl}?id=${subjectId}`;
    return this.http.get<any>(url);
  }

  updateSubject(subjectId: number, newValue: string): Observable<any> {
    const url = `${this.updateSubjectUrl}?id=${subjectId}`;
    return this.http.put<any>(url, { new_value: newValue });
  }

  
}
