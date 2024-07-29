import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';

@Injectable()
export class TimeLogService {
  private checkUserUrl = `${environment.apiUrl}/check_user.php`;
  private timeInUrl = `${environment.apiUrl}/time_in.php`;
  private timeOutUrl = `${environment.apiUrl}/time_out.php`;
  private checkTimeInUrl = `${environment.apiUrl}/check_timein.php`;

  constructor(private http: HttpClient) { }

  checkUser(role: string, identifier: string): Observable<any> {
    return this.http.post<any>(this.checkUserUrl, { role, identifier });
  }

  logTimeIn(userId: number): Observable<any> {
    return this.http.post<any>(this.timeInUrl, { user_id: userId });
  }

  logTimeOut(userId: number): Observable<any> {
    return this.http.post<any>(this.timeOutUrl, { user_id: userId });
  }

  checkTimeIn(identifier: string): Observable<any> {
    return this.http.post<any>(this.checkTimeInUrl, { identifier });
  }
}