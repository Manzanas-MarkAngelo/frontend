import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';

@Injectable()
export class AddMaterialService {

  private apiUrl = `${environment.apiUrl}/add_material.php`;

  constructor(private http: HttpClient) { }

  addBook(bookDetails: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, bookDetails);
  }
}
