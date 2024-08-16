import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';

@Injectable({
  providedIn: 'root'
})
export class ReturnService {
  private borrowingDataUrl = `${environment.apiUrl}/fetch_borrowing_data.php`;
  private returnBookUrl = `${environment.apiUrl}/return_book.php`;

  constructor(private http: HttpClient) {}

  getBorrowingData(): Observable<any> {
    return this.http.get<any>(this.borrowingDataUrl);
  }

  returnBook(material_id: number): Observable<any> {
    return this.http.post<any>(this.returnBookUrl, { material_id });
  }
}