import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = `${environment.apiUrl}/feedback.php`;

  constructor(private http: HttpClient) {}

  getQuestions(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?action=getQuestions`);
  }

  submitFeedback(feedbackData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, feedbackData);
  }
}