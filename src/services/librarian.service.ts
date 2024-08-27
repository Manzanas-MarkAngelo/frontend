import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';

@Injectable()
export class LibrarianService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getLibrarianById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fetch_librarian.php?id=${id}`);
  }

  updateLibrarian(id: number, librarianData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update_librarian.php`, { id, ...librarianData });
  }
}