import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private emailUrl = `${environment.apiUrl}/send_book_request.php`;

  constructor(private http: HttpClient) {}

  sendEmail(emails: string[]): Observable<any> {
    return this.http.post<any>(this.emailUrl, { emails }, {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  sendBorrowNotification(userId: string, materialId: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/send_borrow_notification.php`, { user_id: userId, material_id: materialId }, {
      headers: { 'Content-Type': 'application/json' }
    });
  }  
}