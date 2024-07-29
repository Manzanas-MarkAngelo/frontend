import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';

@Injectable()
export class TimeLogService {
  private checkUserUrl = `${environment.apiUrl}/check_user.php`;
  private timeInUrl = `${environment.apiUrl}/time_in.php`;
  private checkTimeInUrl = `${environment.apiUrl}/check_timein.php`;
  private timeOutUrl = `${environment.apiUrl}/time_out.php`;

  constructor(private http: HttpClient) { }

  checkUser(role: string, identifier: string): Observable<any> {
    const payload = { role, identifier };
    return this.http.post<any>(this.checkUserUrl, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  logTimeIn(userId: number): Observable<any> {
    const payload = { user_id: userId };
    return this.http.post<any>(this.timeInUrl, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  checkTimeIn(identifier: string): Observable<any> {
    const payload = { identifier };
    return this.http.post<any>(this.checkTimeInUrl, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  logTimeOut(userId: number): Observable<any> {
    const payload = { user_id: userId };
    return this.http.post<any>(this.timeOutUrl, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}