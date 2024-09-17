import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';

@Injectable({
  providedIn: 'root',
})
export class BookRequestService {
  private requestUrl = `${environment.apiUrl}/book_request.php`;

  constructor(private http: HttpClient) {}

  submitBookRequest(requestData: any): Observable<any> {
    return this.http.post<any>(this.requestUrl, requestData);
  }
}